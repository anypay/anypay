
import { cancelInvoice, Invoice } from '../../../lib/invoices';
import { findOne } from '../../../lib/orm';

import { createPaymentRequest } from '../../../lib/payment_requests'

export async function create(req, h) {

  let result = await createPaymentRequest(
    req.app_id,
    req.payload.template,
    req.payload.options
  )

  return h.response(result)

}

export async function cancel(req, h) {

  const invoice: Invoice = await findOne<Invoice>(Invoice, {
    where: {
      uid: req.params.uid
    }
  })

  if (!invoice) {

    return h.notFound()
  }

  if (invoice.get('app_id') !== req.app.id) {

    return h.notAuthorized()
  }

  await cancelInvoice(invoice)

  return h.response({ success: true })

}
