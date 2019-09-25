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
  handlePayment, updateOutput,
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

        await updateOutput(payment)

        channel.ack(message);

     }

    } catch(error) {

      log.error(error.message);
      log.error(error);
      channel.ack(message);
    }
  }
}

export function PaymentConsumer(channel: Channel) {
  return async function(message: Message) {

    var msgString = message.content.toString();

    log.info('Payment Consumer', msgString);

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
