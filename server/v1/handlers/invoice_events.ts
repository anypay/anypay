
import { listInvoiceEvents } from '../../../lib/events'

import { ensureInvoice } from '../../../lib/invoices'

import { unauthorized } from 'boom'

export async function index(request, h) {

  let invoice = await ensureInvoice(request.params.invoice_uid)

  if (invoice.account_id !== request.account.id) {

    return unauthorized()

  }

  let events = await listInvoiceEvents(invoice)

  return h.response({

    invoice_uid: request.params.invoice_uid,

    events: events.map(event => event.toJSON())

  })

};

