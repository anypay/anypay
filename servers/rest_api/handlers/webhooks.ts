
import { listForAccount, attemptWebhook, webhookForInvoice } from '../../../lib/webhooks'

import { findAccount, Account } from '../../../lib/account'

import { ensureInvoice } from '../../../lib/invoices'

export async function index(req, h) {

  try {

    let account = await findAccount(req.account.id)

    let webhooks = await listForAccount(account, {
      limit: req.query.limit,
      offset: req.query.offset
    })

    return { webhooks }

  } catch(error) {

    console.log('ERROR', error)

    return { error }
  }
}

export async function attempt(req, h) {

  try {

    let account = new Account(req.account);

    let invoice = await ensureInvoice(req.params.invoice_uid);

    if (invoice.account_id !== account.id) {

      return h.response({ error: 'invoice not authorized' }).code(401)

    }

    let webhook = await webhookForInvoice(invoice)

    console.log('ATTEMPT WEBHOOK', webhook)

    let attempt = await attemptWebhook(webhook)

    console.log('ATTEMPT', attempt)

    webhook = await webhookForInvoice(invoice)
    
    return h.response({ attempt: attempt.toJSON(), webhook: webhook.toJSON() }).code(201)

  } catch(error) {

    console.log('ATTEMPT ERROR', error)

    return h.response({ error: error.message }).code(500)
  
  }

}
