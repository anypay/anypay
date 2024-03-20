
import { buildPaymentRequestForInvoice, detectWallet } from '../../../lib/pay';

import { log, models } from '../../../lib';

import { submitPayment, SubmitPaymentResponse } from '../../../lib/pay/json_v2/protocol';
import { Request, ResponseToolkit } from '@hapi/hapi';

export async function show(request: Request, h: ResponseToolkit) {

  let { content } = await buildPaymentRequestForInvoice({
    uid: request.params.uid,
    currency: 'BSV', 
    protocol: 'BIP270'
  })

  log.info(`pay.request.bsv.content`, content)

  let response = h.response(content);

  response.type('application/json');

  return response;

}

export async function create(request: Request, h: ResponseToolkit) {

  log.info('bsv.bip270.broadcast', {
    headers: request.headers,
    payload: request.payload
  })

  let invoice = await models.Invoice.findOne({
    where: { uid: request.params.uid }
  })

  const payload = request.payload as {
    transaction: string
  }

  try {

    let wallet = detectWallet(request.headers, request.params.uid)

    let submission = {
      transactions: [{txhex: payload.transaction }],
      currency: 'BSV',
      invoice_uid: request.params.uid,
      wallet
    }

    if (invoice.cancelled) {

      log.error('payment.error.invoicecancelled', new Error('Invoice Already Cancelled'))

      throw new Error('Invoice Already Cancelled')

    }

    let response: SubmitPaymentResponse = await submitPayment(submission)

    log.info('bsv.bip270.broadcast.success', {
      headers: request.headers,
      payload: request.payload,
      response
    })

    return {

      payment: request.payload,

      memo: "Payment Approved By Anypay®",

      error: 0

    }

  } catch(error: any) {

    log.error('bsv.bip270.broadcast.failed', error)

    return h.response({

      payment: request.payload,
      
      memo: error.message,

      error: 1

    }).code(500)

  }

}

