
import { cancelInvoice } from '../../../lib/invoices';
import { log } from '../../../lib/log';

import { createPaymentRequest } from '../../../lib/payment_requests'
import { ResponseToolkit } from '@hapi/hapi';
import { badRequest, notFound } from '@hapi/boom';
import prisma from '../../../lib/prisma';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {
  const payload = request.payload as {
    template: string;
    options: any;
  }

  try {

    let result = await createPaymentRequest(
      request.app_id,
      payload.template,
      payload.options
    )

    return h.response(result)

  } catch(error: any) {

    log.error('pay.request.create.error', error)

    return badRequest(error.message)

  }

}

export async function cancel(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    const invoice = await prisma.invoices.findFirst({
      where:{ uid: request.params.uid }
    })


  
    if (!invoice) {
  
      return notFound()
    }
  
    if (invoice.app_id !== request.app_id) {
  
      return notAuthorized()
    }
  
    await cancelInvoice(invoice)
  
    return h.response({ success: true })

  } catch(error: any) {

    log.error('api.payment-requests.cancel', error)

    return badRequest(error.message)

  }

}
function notAuthorized() {
  throw new Error('Function not implemented.');
}

