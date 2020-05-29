require('dotenv').config();

import { log } from '../../lib';

import { Actor } from 'rabbi'

import { sendWebhookForInvoice } from '../../lib/webhooks';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    bindingkey: 'invoice:paid',

    queue: 'webhooks.invoice.tosend'

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    try {

      let webhook = await sendWebhookForInvoice(uid);

      console.log('webhook.sent', webhook.toJSON());

    } catch(error) {

      log.error('webhook.failed', error.message);

    }

    await channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}

