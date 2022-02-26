require('dotenv').config();

import { log } from '../../lib';

import { logInfo } from '../../lib/logger'

import { Actor } from 'rabbi'
//import { Actor } from '/Users/zyler/github/rabbijs/rabbi'

import { Webhook, getPaidWebhookForInvoice, sendWebhookForInvoice } from '../../lib/webhooks';

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

      logInfo('webhook.sendforinvoice', { uid });

      let invoice: Invoice = await ensureInvoice(uid)

      logInfo('webhook.invoice', { invoice });

      let account: Account = await invoice.getAccount()

      logInfo('webhook.account', { account });

      let webhook = await getPaidWebhookForInvoice(invoice)

      logInfo('webhook', webhook)

      if (webhook) {

        let attempt = await webhook.attemptWebhook()

        logInfo('webhook.attempt', attempt.record.toJSON());

      } else {

        logInfo('webhook.sendforinvoice')

        let result = await sendWebhookForInvoice(invoice.record, 'actor_onpaid')

        logInfo('webhook.sendforinvoice.result', result)

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

