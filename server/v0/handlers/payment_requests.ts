
import { cancelInvoice, Invoice } from '../../../lib/invoices';
import { log } from '../../../lib/log';
import { findOne } from '../../../lib/orm';

import { createPaymentRequest } from '../../../lib/payment_requests'

export async function create(req, h) {

  try {

    let result = await createPaymentRequest(
      req.app_id,
      req.payload.template,
      req.payload.options
    )

    return h.response(result)

  } catch(error) {

    log.error('pay.request.create.error', error)

    return h.badRequest(error)

  }

}

export async function cancel(req, h) {

  try {

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

  } catch(error) {

    log.error('api.payment-requests.cancel', error)

    return h.badRequest(error)

  }

}
