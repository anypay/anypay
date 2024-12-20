
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { listInvoiceEvents } from '@/lib/events'

import { ensureInvoice } from '@/lib/invoices'

import { unauthorized } from '@hapi/boom'
import { Request, ResponseToolkit } from '@hapi/hapi'

export async function index(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let invoice = await ensureInvoice(request.params.invoice_uid)

  if (invoice.account_id !== (request as AuthenticatedRequest).account.id) {

    return unauthorized()

  }

  let events = await listInvoiceEvents(invoice)

  return h.response({

    invoice_uid: request.params.invoice_uid,

    events

  })

};

