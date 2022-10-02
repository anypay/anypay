
import { log } from '../../../lib/log';

import { listInvoiceEvents } from '../../../lib/events'

import { ensureInvoice } from '../../../lib/invoices'

export async function index(request, h) {

  try {

    let invoice = await ensureInvoice(request.params.invoice_uid)

    if (invoice.account_id !== request.account.id) {

      throw h.boom.Unathorized()

    }

    let events = await listInvoiceEvents(invoice)

    return h.response({

      invoice_uid: request.params.invoice_uid,

      events: events.map(event => event.toJSON())

    })

  } catch(error) {

    log.error('invoices.events.list.error', error)

    return h.response({

      error: error.message

    })
    .code(500)

  }

};

