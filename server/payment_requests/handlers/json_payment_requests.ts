
import { log } from '../../../lib'

import { buildPaymentRequestForInvoice, getCurrency } from '../../../lib/pay';

import * as Hapi from 'hapi';

export async function show(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let currency = getCurrency({
    headers: req.headers,
    protocol: 'JSONV2'
  })

  log.info(`paymentrequest.jsonv2`, {
    currency: currency.code,
    invoice_uid: req.params.uid
  })

  const paymentRequest = await buildPaymentRequestForInvoice({
    uid: req.params.uid,
    currency: currency.code,
    protocol: 'JSONV2'
  })

  let response = h.response(paymentRequest.content);

  response.type('application/payment-request');

  response.header('Content-Type', 'application/payment-request');

  response.header('Accept', 'application/payment');

  return response;

}

