require('dotenv').config();
import amqp = require("amqplib");
var Blockcypher = require("../../../lib/blockcypher");
var Invoice = require("../../../lib/models/invoice");
var Slack = require("../../../lib/slack/notifier");

import { BigNumber } from "bignumber.js"

import { log } from '../../../lib';

var AMQP_URL = process.env.AMQP_URL;
var QUEUE = "blockcypher:webhooks";
var BITCOIN_QUEUE  = "blockcypher:bitcoin:webhooks";
var LITECOIN_QUEUE = "blockcypher:litecoin:webhooks";
var DASH_QUEUE     = "blockcypher:dash:webhooks";
var DOGECOIN_QUEUE = "blockcypher:dogecoin:webhooks";

var PAYMENT_QUEUE  = "anypay:payments:received";

class InvoiceNotFoundError extends Error {}
class InvoiceUnderpaidError extends Error {}
class InvoiceOverPaidError extends Error {}

async function parseWebhookMessage(message, coin, blockcypherFee) {

    let webhook;

    try { webhook = JSON.parse(message.content.toString());
      log.info(`blockcypher:${coin}:webhook`,webhook);
    } catch (error) {
      log.error("invalid webhook message format");
      throw error;
    }

    if (!webhook.input_address) {
      log.error("no input_address in webhook, invalid format");
      throw new Error('no input_address');
    }

    let webhookValue = new BigNumber(webhook.value);

    let fee = new BigNumber(blockcypherFee);

    let satoshis = new BigNumber(100000000);

    let address = webhook.input_address;

    var amount = webhookValue.plus(fee).dividedBy(satoshis);

    let hash = webhook.input_transaction_hash;
    
    return { address, amount: amount.toNumber(), hash };
}

function WebhookConsumer(currency, channel) {
  return async function(message) {
    try {

      let addressForwardCallback = JSON.parse(message.content.toString());

      log.info('addressForwardCallback', addressForwardCallback);

      let record = await Blockcypher.recordAddressForwardCallback(addressForwardCallback);

      log.info('addressForwardCallback.recorded', record.toJSON());
    
      var payment = await parseWebhookMessage(message, currency.name, currency.fee);

    } catch(error) {

      log.error(error.message);
      await channel.ack(message);
    }

    await channel.sendToQueue(PAYMENT_QUEUE, new Buffer(JSON.stringify({
      address: payment.address,
      currency: currency.code,
      amount: payment.amount,
      hash: payment.hash
    })));

    await channel.ack(message);
  };
}

var currencies = [
  {
    code: 'BTC',
    name: 'bitcoin',
    queue: BITCOIN_QUEUE,
    fee: Blockcypher.BITCOIN_FEE
  },
  {
    code: 'LTC',
    name: 'litecoin',
    queue: LITECOIN_QUEUE,
    fee: Blockcypher.LITECOIN_FEE
  },
  {
    code: 'DOGE',
    name: 'dogecoin',
    queue: DOGECOIN_QUEUE,
    fee: Blockcypher.DOGECOIN_FEE
  },
  {
    code: 'DASH',
    name: 'dash',
    queue: DASH_QUEUE,
    fee: Blockcypher.DASH_FEE
  }
];

amqp.connect(AMQP_URL).then(conn => {
  return conn.createChannel().then(async (channel) => {
    log.info("amqp:channel:connected");

    currencies.forEach(async (currency) => {

      await channel.assertQueue(currency.queue, { durable: true })
      let consumer = WebhookConsumer(currency, channel);
      channel.consume(currency.queue, consumer, { noAck: false });

    });
  });
});
