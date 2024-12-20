
import { protocol, schema } from '@/lib/pay/json_v2'
import { detectWallet } from '@/lib/pay'

import { badRequest, notFound } from '@hapi/boom'

import { getInvoice } from '@/lib/invoices'
import { log } from '@/lib/log'
import { Request, ResponseToolkit } from '@hapi/hapi'


export interface RequestWithInvoice extends Request {
  invoice: any
}

async function ensureInvoice(request: RequestWithInvoice | Request) {

  (request as RequestWithInvoice).invoice = await getInvoice((request as RequestWithInvoice).params.uid)
  
  if (!(request as RequestWithInvoice).invoice) { throw notFound() }

  if ((request as RequestWithInvoice).invoice.status === 'paid') {
    throw new Error('invoice already paid')
  }

  if ((request as RequestWithInvoice).invoice.status === 'cancelled') {
    throw new Error('invoice cancelled')
  }

}

export async function listPaymentOptions(request: RequestWithInvoice | Request, h: ResponseToolkit) {

  try {

    await ensureInvoice(request as RequestWithInvoice)

    await schema.Protocol.PaymentOptions.headers.validateAsync(request.headers, {
      allowUnknown: true
    })

    let wallet = detectWallet(request.headers, (request as RequestWithInvoice).invoice.uid)

    let response = await protocol.listPaymentOptions((request as RequestWithInvoice).invoice, { wallet })

    return h.response(response)

  } catch(error: any) {

    log.info('pay.jsonv2.payment-options.error', error)
    log.error('pay.jsonv2.payment-options.error', error)

    return badRequest(error)

  }

}

export async function handlePost(request: RequestWithInvoice | Request, h: ResponseToolkit) {

  try {

    await ensureInvoice(request)

    switch(request.headers['x-content-type']) {

      case('application/payment-request'):

        return getPaymentRequest(request as RequestWithInvoice, h)

      case('application/payment-verification'):

        return verifyUnsignedPayment(request as RequestWithInvoice, h)

      case('application/payment'):

        return submitPayment(request as RequestWithInvoice, h)

      default:
        
        throw new Error('Invalid Content-Type header')

    }

  } catch(error: any) {

    log.info('pay.jsonv2.post.error', { error: error.message })
    
    log.error('pay.jsonv2.post.error', error)

    return h.response({ error: error.message }).code(400)

  }

}

async function getPaymentRequest(request: RequestWithInvoice | Request, h: ResponseToolkit) {

  try {

    await ensureInvoice(request as RequestWithInvoice)

    await schema.Protocol.PaymentRequest.headers.validateAsync(request.headers, { allowUnknown: true })

    let wallet = detectWallet(request.headers, (request as RequestWithInvoice).invoice.uid)

    const payload = request.payload as {
      currency: string;
      chain: string;
    }
    
    let response = await protocol.getPaymentRequest((request as RequestWithInvoice).invoice, payload, { wallet })

    await schema.Protocol.PaymentRequest.response.validate(response)

    return h.response(response)

  } catch(error: any) {

    log.error('pay.jsonv2.payment-request.error', error)

    return h.response({ error: error.message }).code(400)

  }

}

async function verifyUnsignedPayment(request: RequestWithInvoice | Request, h: ResponseToolkit) {

  try {

    await ensureInvoice(request as RequestWithInvoice)

    await schema.Protocol.PaymentVerification.headers.validateAsync(request.headers, { allowUnknown: true })

    let wallet = detectWallet(request.headers, (request as RequestWithInvoice).invoice.uid)

    const payload = request.payload as {
      currency: string;
      chain: string;
      transactions: any[];
    }

    var params = request.payload as {
      currency: string;
      chain: string;
      transactions: any[];
    }

    params.transactions = payload.transactions.map((transaction: any) => {
      return {
        txhex: transaction.tx,
        txkey: transaction.tx_key,
        txid: transaction.txid
      }
    })

    let response = await protocol.verifyUnsignedPayment((request as RequestWithInvoice).invoice, params, { wallet })

    await schema.Protocol.PaymentVerification.response.validate(response)

    return h.response(response)

  } catch(error: any) {

    log.info('pay.jsonv2.payment-verification.error', {
      error: error.message,
      account_id: (request as RequestWithInvoice).invoice.account_id,
      invoice_uid: (request as RequestWithInvoice).invoice.uid
    })

    return badRequest(error)

  }

}

async function submitPayment(request: RequestWithInvoice | Request, h: ResponseToolkit) {

  try {

    await schema.Protocol.Payment.headers.validateAsync(request.headers, { allowUnknown: true })

    let wallet = detectWallet(request.headers, (request as RequestWithInvoice).invoice.uid)

    await ensureInvoice(request as RequestWithInvoice)

    var params = request.payload as {
      currency: string;
      chain: string;
      transactions: any[];
    }

    const payload = request.payload as {
      currency: string;
      chain: string;
      transactions: any[];
    }

    params.transactions = payload.transactions.map((transaction: any) => {
      return {
        txhex: transaction.tx,
        txkey: transaction.tx_key,
        txid: transaction.tx_hash || transaction.txid
      }
    })

    let response = await protocol.sendSignedPayment((request as RequestWithInvoice).invoice, payload, { wallet })

    //await schema.Protocol.Payment.response.validateAsync(response)

    return h.response(response)

  } catch(error: any) {

    console.log(error)

    log.error('pay.jsonv2.payment.error', error)

    return badRequest(error)

  }

}

