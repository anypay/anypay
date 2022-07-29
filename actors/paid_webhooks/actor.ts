require('dotenv').config();

import { log } from '../../lib/log'

import { Actor } from 'rabbi'

import { getPaidWebhookForInvoice, sendWebhookForInvoice } from '../../lib/webhooks';

import { ensureInvoice, Invoice } from '../../lib/invoices'

import { Account } from '../../lib/account'

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'webhooks.invoice.tosendpaid'

  })
  .start(async (channel, msg) => {

    try {

      let uid = msg.content.toString();

      log.info('webhook.sendforinvoice', { uid });

      let invoice: Invoice = await ensureInvoice(uid)

      log.info('webhook.invoice', { invoice });

      let account: Account = await invoice.getAccount()

      log.info('webhook.account', { account });

      let webhook = await getPaidWebhookForInvoice(invoice)

      log.info('webhook', webhook)

      if (webhook) {

        let attempt = await webhook.attemptWebhook()

        log.info('webhook.attempt', attempt.record.toJSON());

      } else {

        log.info('webhook.sendforinvoice')

        let result = await sendWebhookForInvoice(invoice.uid, 'actor_onpaid')

        log.info('webhook.sendforinvoice.result', result)

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

