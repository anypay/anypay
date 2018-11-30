require('dotenv').config();
const amqp = require("amqplib");
const log = require("winston");
const Blockcypher = require("../../../lib/blockcypher");
const Invoice = require("../../../lib/models/invoice");
const Account = require("../../../lib/models/account");
const Slack = require("../../../lib/slack/notifier");

import {Connection, Channel, Message} from "amqplib"; 
import {paymentSchema} from '../../../jsonschema/payment';
import {Validator} from 'jsonschema';
import {statsd} from '../../../lib/stats/statsd'

import * as validate from 'validator';
import * as http from 'superagent';

import {
  handlePayment,
} from '../../../lib/payment_processor';

import {Payment} from '../../../types/interfaces';


const AMQP_URL = process.env.AMQP_URL;
const PAYMENT_QUEUE  = "anypay:payments:received";
const validator = new Validator();

function handlePaymentMessage(payment: Payment) {
  console.log('handle payment', payment);
  statsd.increment('handlePaymentMessage')

	/*
    1. Query unpaid invoices for the specific amount.
      - Mark invoice as paid
    2. If not found, query for most recent unpaid invoice for that amount.
      - Mark invoice as underpaid
      - Set the paid amount
    3. If not found, throw an Exception, this should not be happening.
  */

  return async function(channel: Channel, message: Message) {

    await channel.publish('anypay', 'payments', new Buffer(JSON.stringify(payment)));

		var invoice;

    try {
      
      invoice = await Invoice.findOne({
        where: {
          currency: payment.currency,
          address: payment.address,
          status: "unpaid"
        },
        order: [['createdAt', 'DESC']]
      });

      if (invoice) {

        statsd.increment('handlePaymentMessage_invoiceFound') 

        invoice = invoice.toJSON();
        console.log("INVOICE", invoice);

        invoice = await handlePayment(invoice, payment);

				log.info("invoices:paid", invoice.uid);

        await channel.ack(message);
        await channel.publish('anypay:invoices', 'invoice:paid', new Buffer(invoice.uid));

        let account = await Account.findOne({
	  where: {
            id: invoice.account_id
	  }
        });

        Slack.notify(
          `invoice:${invoice.status} ${account.email} https://pos.anypay.global/invoices/${invoice.uid}`
        );

      } else {

        log.error('no unpaid invoice found matching currency and address');
      
	statsd.increment('handlePaymentMessage_invoiceNotFound')

        channel.ack(message);
      }

    } catch(error) {

      log.error(error.message);
      log.error(error);
      channel.ack(message);
    }
  }
}

function PaymentConsumer(channel: Channel) {
  return async function(message: Message) {

    var msgString = message.content.toString();

    log.info('raw message string', msgString);

    try {

      var payment = JSON.parse(msgString);

      // TODO: Validate data with JSONSchema
      handlePaymentMessage(payment)(channel, message);

    } catch(error) {

      log.error('error parsing json from message', msgString);

      await channel.ack(message);

    }
  };
}

amqp.connect(AMQP_URL).then(async (conn: Connection) => {

  let channel: Channel = await conn.createChannel()

  log.info("amqp:channel:connected");

  await channel.assertQueue(PAYMENT_QUEUE, { durable: true });

  await channel.assertExchange('anypay', 'fanout');

  await channel.assertExchange('anypay.payments', 'direct');

  await channel.assertExchange('anypay:invoices', 'fanout');

  await channel.bindQueue(PAYMENT_QUEUE, 'anypay.payments', 'payment');

  let consumer = PaymentConsumer(channel);

  channel.consume(PAYMENT_QUEUE, consumer, { noAck: false });

  await channel.assertQueue('webhooks.invoice', { durable: true });

  await channel.bindQueue('webhooks.invoice', 'anypay:invoices', 'invoice:paid');

  channel.consume('webhooks.invoice', WebhooksConsumer(channel));

});

function WebhooksConsumer(channel: Channel) {

  return async function(msg: Message) {

    let uid = msg.content.toString();

    log.info('UID', uid);

    let invoice = await Invoice.findOne({ where: { uid }});

    if (!invoice) {

      log.error(`invoice ${uid} not found`);

      channel.ack(msg);

      return;

    }

    log.info('INVOICE', invoice.toJSON());

    if (validate.isURL(invoice.webhook_url)) {

      try {

        await http.post(invoice.webhook_url).send(invoice.toJSON()); 

        log.info('webhook.sent', invoice.toJSON());


      } catch(error) {

        log.error('webhook.failed', invoice.toJSON());

        channel.ack(msg);

      }


    } else {

      log.error('invalid webhook url', invoice.webhook_url);

      channel.ack(msg);

    }

  }

}

