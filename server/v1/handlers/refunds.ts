
import { getRefund } from '../../../lib/refunds'

import { ensureInvoice } from '../../../lib/invoices'

export async function show(req, h) {

    let invoice = await ensureInvoice(req.params.invoice_uid)

    if (invoice.get('account_id') !== req.account.id) {

      return h.response({ error: 'unauthorized' }).code(401)
    }
   
    let refund = await getRefund(invoice, req.query.address)

    console.log('_REFF', refund)

    let refund_invoice = await ensureInvoice(refund.get('refund_invoice_uid'))

    return h.response({
      refund: refund.toJSON(),
      original_invoice: invoice.toJSON(),
      refund_invoice: refund_invoice.toJSON()
    })

}
