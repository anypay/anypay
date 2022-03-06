
import { listForAccount, attemptWebhook, webhookForInvoice } from '../../../lib/webhooks'

import { findAccount, Account } from '../../../lib/account'

import { ensureInvoice } from '../../../lib/invoices'

import { logError } from '../../../lib/logger'

import { badRequest } from 'boom'

export async function index(req, h) {

  try {

    let account: Account = await findAccount(req.account.id)

    let webhooks = await listForAccount(account, {

      limit: req.query.limit,

      offset: req.query.offset

    })

    return { webhooks }

  } catch(error) {

    return badRequest({ error })

  }
}

export async function attempt(request, h) {

  try {

    let invoice = await ensureInvoice(request.params.invoice_uid);

    if (invoice.account_id !== request.account.id) {

      return h.response({ error: 'invoice not authorized' }).code(401)

    }

    let webhook = await webhookForInvoice(invoice)

    let attempt = await attemptWebhook(webhook)

    webhook = await webhookForInvoice(invoice)
    
    return h.response({ attempt: attempt.toJSON(), webhook: webhook.toJSON() }).code(201)

  } catch(error) {

    logError('request.webhook.attempt', {error})

    return h.response({ error: error.message }).code(500)
  
  }

}
