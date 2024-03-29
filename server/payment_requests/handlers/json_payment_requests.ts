
import { Request, ResponseToolkit } from '@hapi/hapi';
import { log } from '../../../lib'

import { detectWallet, buildPaymentRequestForInvoice, getCurrency } from '../../../lib/pay';

import { submitPayment } from '../../../lib/pay/json_v2/protocol'
import { badRequest } from '@hapi/boom';
import prisma from '../../../lib/prisma';

export async function show(request: Request, h: ResponseToolkit) {

  let currency = getCurrency({
    headers: request.headers,
    protocol: 'JSONV2'
  })

  log.info(`paymentrequest.jsonv2`, {
    currency: currency.code,
    invoice_uid: request.params.uid
  })

  const paymentRequest = await buildPaymentRequestForInvoice({
    uid: request.params.uid,
    currency: currency.code,
    protocol: 'JSONV2'
  })

  let response = h.response(paymentRequest.content);

  response.type('application/payment-request');

  response.header('Content-Type', 'application/payment-request');

  response.header('Accept', 'application/payment');

  return response;

}

export async function create(request: Request, h: ResponseToolkit) {

  try {

    const payload = request.payload as {
      chain: string;
      transactions: any[];
    }

    const currency = request.params.currency.toUpperCase()

    const chain = payload.chain.toUpperCase()

    let invoice_uid = request.params.uid

    let transactions = payload.transactions;

    let wallet = detectWallet(request.headers, request.params.uid)

    for (let transaction of transactions) {

      prisma.paymentSubmissions.create({
        data: {
          invoice_uid,
          txhex: transaction,
          headers: request.headers,
          wallet,
          currency,
          chain,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

    }

    let response = await submitPayment({
      currency,
      chain,
      invoice_uid,
      transactions,
      wallet
    })

    return response

  } catch(error: any) {

    log.error('http.payment_requests.JsonPaymentRequests.create', error)

    return badRequest(error.message)

  }

}

