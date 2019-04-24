require('dotenv').config();

import { connect, Channel, Message } from 'amqplib';

import { log, models } from '../../lib';

import * as http from 'superagent';

import * as validate from 'validator';

async function start() {

  log.info('actor.start webhooks');

  let connection = await connect(process.env.AMQP_URL);

  let channel = await connection.createChannel();

  await channel.assertQueue('webhooks.invoice', { durable: true });

  await channel.bindQueue('webhooks.invoice', 'anypay.events', 'invoice.payment');
  await channel.bindQueue('webhooks.invoice', 'anypay.events', 'invoice.complete');

  channel.consume('webhooks.invoice', WebhooksConsumer(channel));

}

function WebhooksConsumer(channel: Channel) {

  return async function(msg: Message) {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid }});

    if (!invoice) {

      log.error(`invoice ${uid} not found`);

      channel.ack(msg);

      return;

    }

    if (validate.isURL(invoice.webhook_url)) {

      try {

        log.info(`sending webhook for ${uid}`);

        let resp = await http.post(invoice.webhook_url).send(invoice.toJSON()); 

        log.info('webhook.sent', invoice.toJSON());

        channel.ack(msg);

      } catch(error) {

        log.error('webhook.failed', error.message);

        channel.nack(msg);

      }


    } else {

      log.error('invalid webhook url', invoice.webhook_url);

      channel.ack(msg);

    }

  }

}

export {

  start

}

if (require.main === module) {

  start();

}

