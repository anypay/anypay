
import { getRefund } from '../../../lib/refunds'

import { ensureInvoice } from '../../../lib/invoices'

import { log } from '../../../lib'

export async function show(req, h) {

  try {

    let invoice = await ensureInvoice(req.params.invoice_uid)

    if (invoice.account_id !== req.account.id) {

      return h.response({ error: 'unauthorized' }).code(401)
    }
   
    let refund = await getRefund(invoice)

    let refund_invoice = await ensureInvoice(refund.get('refund_invoice_uid'))

    return h.response({
      refund: refund.toJSON(),
      original_invoice: invoice.toJSON(),
      refund_invoice: refund_invoice.toJSON()
    })

  } catch(error) {

    log.error('servers.v1.handlers.Refunds.show', error)

    return h.badRequest(error)

  }

}
