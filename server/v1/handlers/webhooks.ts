
import { listForAccount, attemptWebhook, webhookForInvoice } from '../../../lib/webhooks'

import { ensureInvoice } from '../../../lib/invoices'

import { log } from '../../../lib/log'

import { config } from '../../../lib/config'

import axios from 'axios'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let webhooks = await listForAccount(request.account, {

    limit: request.query.limit,

    offset: request.query.offset

  })

  return { webhooks }

}

export async function notifyRocketchat({ uid }: { uid: string }) {

  if (config.get('ROCKETCHAT_WEBHOOK_URL')) {

    let { data } = await axios.post(config.get('ROCKETCHAT_WEBHOOK_URL'), {
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

export async function test(request: AuthenticatedRequest, h: ResponseToolkit) {

  log.info('webhooks.test.received', request.payload)

  return { success: true }

}

export async function attempt(request: AuthenticatedRequest, h: ResponseToolkit) {

  let invoice = await ensureInvoice(request.params.invoice_uid);

  if (invoice.account_id !== request.account.id) {

    return h.response({ error: 'invoice not authorized' }).code(401)

  }

  let webhook = await webhookForInvoice(invoice)

  let attempt = await attemptWebhook(webhook)

  webhook = await webhookForInvoice(invoice)
  
  return h.response({ attempt: attempt, webhook: webhook }).code(201)

}
