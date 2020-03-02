require('dotenv').config();

import { log, models } from '../../lib';

import { Actor } from 'rabbi'

import * as http from 'superagent';

import * as validate from 'validator';

async function start() {

  Actor.create({
    exchange: 'anypay:invoices',
    bindingkey: 'invoice:paid',
    queue: 'webhooks.invoice.tosend'
  })
  .start(async (channel, msg) => {
    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid }});

    if (!invoice) {

      log.error(`invoice ${uid} not found`);

      channel.ack(msg);

      return;

    }

    var valid;

    try {
      console.log(invoice.webhook_url);

      valid = validate.isURL(invoice.webhook_url)

    } catch(error) {

      valid = false;

    }

    if (valid) {

      try {

        log.info(`sending webhook for ${uid}`);

        let resp = await http.post(invoice.webhook_url).send(invoice.toJSON()); 

        log.info('webhook.sent', invoice.toJSON());

        channel.ack(msg);

      } catch(error) {

        log.error('webhook.failed', error.message);

        channel.ack(msg);

      }


    } else {

      log.error('invalid webhook url', invoice.webhook_url);

      channel.ack(msg);

    }

  });


}

export {

  start

}

if (require.main === module) {

  start();

}

