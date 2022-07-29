
import { listForAccount, attemptWebhook, webhookForInvoice } from '../../../lib/webhooks'

import { findAccount, Account } from '../../../lib/account'

import { ensureInvoice } from '../../../lib/invoices'

import { log } from '../../../lib/log'

import { config } from '../../../lib/config'

import axios from 'axios'

export async function index(req, h) {

  let account: Account = await findAccount(req.account.id)

  let webhooks = await listForAccount(account, {

    limit: req.query.limit,

    offset: req.query.offset

  })

  return { webhooks }

}

async function notifyRocketchat({ uid }) {

  if (config.get('rocketchat_webhook_url')) {

    let { data } = await axios.post(config.get('rocketchat_webhook_url'), {
      "alias": "webhooks",
      "text": "Payment Webhook Received",
      "attachments": [
        {
          "title": `Anypay Invoice ${uid}`,
          "text": `Anypay Invoice ${uid}`,
          //"image_url": "/images/integration-attachment-example.png",
          "color": "#764FA5"
        }
      ]
    }) 

    log.debug('rocketchat.webhook.result', data)

  }

}

export async function test(req, h) {

  log.info('webhooks.test.received', req.payload)

  const { uid } = req.payload

  notifyRocketchat({ uid }) 

  return { success: true }

}

export async function attempt(request, h) {

  let invoice = await ensureInvoice(request.params.invoice_uid);

  if (invoice.account_id !== request.account.id) {

    return h.response({ error: 'invoice not authorized' }).code(401)

  }

  let webhook = await webhookForInvoice(invoice)

  let attempt = await attemptWebhook(webhook)

  webhook = await webhookForInvoice(invoice)
  
  return h.response({ attempt: attempt.toJSON(), webhook: webhook.toJSON() }).code(201)

}
