
import { models, log } from '../../../lib'

import { detectWallet, buildPaymentRequestForInvoice, getCurrency } from '../../../lib/pay';

import { submitPayment } from '../../../lib/pay/json_v2/protocol'

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

export async function create(req, h) {

  try {

    const currency = req.params.currency.toUpperCase()

    let invoice_uid = req.params.uid

    let transactions = req.payload.transactions;

    let wallet = detectWallet(req.headers, req.params.uid)

    for (let transaction of transactions) {

      models.PaymentSubmission.create({
        invoice_uid,
        txhex: transaction,
        headers: req.headers,
        wallet,
        currency
      })
    }

    let response = await submitPayment({
      currency,
      invoice_uid,
      transactions,
      wallet
    })

    return response

  } catch(error) {

    log.error('http.payment_requests.JsonPaymentRequests.create', error)

    return h.badRequest(error)

  }

}

