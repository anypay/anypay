require('dotenv').config();

import { log } from '../../lib';

import { Actor } from 'rabbi'

import { sendWebhookForInvoice } from '../../lib/webhooks';

import { exchange } from '../../lib/amqp';

export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'webhooks.invoice.tosend'

  })
  .start(async (_channel, _msg, json) => {

    const { uid } = json

    try {

      await sendWebhookForInvoice(uid, 'actor_on_invoice_paid');
      
    } catch(error) {

      log.error('webhook.failed', error);

    }

  });


}

if (require.main === module) {

  start();

}

