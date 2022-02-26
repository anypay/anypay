require('dotenv').config();

import { log } from '../../lib';

import { logInfo } from '../../lib/logger'

import { Actor } from 'rabbi'

import { Webhook, getPaidWebhookForInvoice } from '../../lib/webhooks';

import { ensureInvoice, Invoice } from '../../lib/invoices'

import { Account } from '../../lib/account'

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'webhooks.invoice.tosend'

  })
  .start(async (channel, msg) => {

    try {

      let uid = msg.content.toString();

      let invoice: Invoice = await ensureInvoice(uid)

      let account: Account = await invoice.getAccount()

      let webhook = await getPaidWebhookForInvoice(invoice)

      if (webhook) {

        let attempt = await webhook.attemptWebhook()

        logInfo('webhook.attempt', attempt.record.toJSON());

      }

    } catch(error) {

      log.error('webhook.failed', error.message);

    }

    await channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}

