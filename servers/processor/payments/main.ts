require('dotenv').config();
const amqp = require("amqplib");
const log = require("winston");
const Blockcypher = require("../../../lib/blockcypher");
const Slack = require("../../../lib/slack/notifier");

import { models } from '../../../lib';

import * as forwarderEventsActor from '../../../actors/forwarder_events/actor';

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

export function handlePaymentMessage(payment: Payment) {
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
      
      invoice = await models.Invoice.findOne({
        where: {
          currency: payment.currency,
          address: payment.address,
          status: "unpaid"
        },
        order: [['createdAt', 'DESC']]
      });

      if (invoice) {

        let invoiceUID = invoice.uid;

        statsd.increment('handlePaymentMessage_invoiceFound') 

        invoice = invoice.toJSON();
        console.log("INVOICE", invoice);

        invoice = await handlePayment(invoice, payment);

        if (invoice) {

          log.info("invoices:paid", invoice.uid);

          await channel.publish('anypay:invoices', 'invoice:paid', new Buffer(invoice.uid));

          let account = await models.Account.findOne({
      where: {
              id: invoice.account_id
      }
          });

          invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

          if (account.email !== 'diagnostic@anypay.global') {

            Slack.notify(
              `invoice:${invoice.status} ${account.email} https://pos.anypay.global/invoices/${invoice.uid}`
            );

          }

        } else {

          Slack.notify(
            `payment for expired invoice ${invoiceUID} ${JSON.stringify(payment)}`
          );

        }

        await channel.ack(message);

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

  log.info('consume channel', PAYMENT_QUEUE);

  channel.consume(PAYMENT_QUEUE, consumer, { noAck: false });

  await channel.assertQueue('webhooks.invoice', { durable: true });

  await channel.bindQueue('webhooks.invoice', 'anypay:invoices', 'invoice:paid');

  channel.consume('webhooks.invoice', WebhooksConsumer(channel));

  log.info('consumed queue', 'webhooks.invoice');

  if (process.env.FORWARDER_EVENTS_ACTOR) {

    log.info('starting forwarding events actor');

    await forwarderEventsActor.start();

  } else {

    log.info('not starting forwarding events actor');

  }

})
.catch(error => {

  log.error(error.message);

});

function WebhooksConsumer(channel: Channel) {

  return async function(msg: Message) {

    let uid = msg.content.toString();

    log.info('UID', uid);

    let invoice = await models.Invoice.findOne({ where: { uid }});

    if (!invoice) {

      log.error(`invoice ${uid} not found`);

      channel.ack(msg);

      return;

    }

    log.info('INVOICE', invoice.toJSON());

    if (validate.isURL(invoice.webhook_url)) {

      try {

        await http.post(invoice.webhook_url).send(invoice.toJSON()); 
        
        channel.ack(msg);

        log.info('webhook.sent', invoice.toJSON());


      } catch(error) {

        log.error('webhook.failed', invoice.toJSON());

        channel.nack(msg);

      }


    } else {

      log.error('invalid webhook url', invoice.webhook_url);

      channel.ack(msg);

    }

  }

}

