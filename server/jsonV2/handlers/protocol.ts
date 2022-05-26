
import { protocol, schema } from '../../../lib/pay/json_v2'
import { detectWallet } from '../../../lib/pay'

import { badRequest, notFound } from 'boom'

import { getInvoice } from '../../../lib/invoices'
import { log } from '../../../lib/log'

async function ensureInvoice(req) {

  req.invoice = await getInvoice(req.params.uid)

  if (!req.invoice) { throw notFound() }

  if (req.invoice.status === 'paid') {
    throw new Error('invoice already paid')
  }

  if (req.invoice.status === 'cancelled') {
    throw new Error('invoice cancelled')
  }

}

export async function listPaymentOptions(req, h) {

  try {

    await ensureInvoice(req)

    let valid = await schema.Protocol.PaymentOptions.headers.validateAsync(req.headers, {
      allowUnknown: true
    })

    let wallet = detectWallet(req.headers, req.invoice.uid)

    let response = await protocol.listPaymentOptions(req.invoice, { wallet })

    return h.response(response)

  } catch(error) {

    log.info('pay.jsonv2.payment-options.error', error)
    log.error('pay.jsonv2.payment-options.error', error)

    return badRequest({ error: error.message })

  }

}

export async function handlePost(req, h) {

  try {

    await ensureInvoice(req)

    switch(req.headers['x-content-type']) {

      case('application/payment-request'):

        return getPaymentRequest(req, h)

      case('application/payment-verification'):

        return verifyUnsignedPayment(req, h)

      case('application/payment'):

        return submitPayment(req, h)

      default:
        
        throw new Error('Invalid Content-Type header')

    }

  } catch(error) {

    log.info('pay.jsonv2.post.error', { error: error.message })
    log.error('pay.jsonv2.post.error', error)

    return h.response({ error: error.message }).code(400)

  }

}

async function getPaymentRequest(req, h) {

  try {

    await ensureInvoice(req)

    await schema.Protocol.PaymentRequest.headers.validateAsync(req.headers, { allowUnknown: true })

    let wallet = detectWallet(req.headers, req.invoice.uid)
    
    let response = await protocol.getPaymentRequest(req.invoice, req.payload, { wallet })

    await schema.Protocol.PaymentRequest.response.validate(response)

    return h.response(response)

  } catch(error) {

    log.error('pay.jsonv2.payment-request.error', error)
    log.info('pay.jsonv2.payment-request.error', error)
    console.error('pay.jsonv2.payment-request.error', error)

    return h.response({ error: error.message }).code(400)

  }

}

async function verifyUnsignedPayment(req, h) {

  try {

    await ensureInvoice(req)

    await schema.Protocol.PaymentVerification.headers.validateAsync(req.headers, { allowUnknown: true })

    let wallet = detectWallet(req.headers, req.invoice.uid)

    let response = await protocol.verifyUnsignedPayment(req.invoice, req.payload, { wallet })

    await schema.Protocol.PaymentVerification.response.validate(response)

    return h.response(response)

  } catch(error) {

    log.info('pay.jsonv2.payment-verification.error', { error: error.message })
    log.error('pay.jsonv2.payment-verification.error', error)

    return badRequest({ error: error.message })

  }

}

async function submitPayment(req, h) {

  try {

    await schema.Protocol.Payment.headers.validateAsync(req.headers, { allowUnknown: true })

    let wallet = detectWallet(req.headers, req.invoice.uid)

    await ensureInvoice(req)

    let response = await protocol.sendSignedPayment(req.invoice, req.payload, { wallet })

    //await schema.Protocol.Payment.response.validateAsync(response)

    return h.response(response)

  } catch(error) {

    log.error('pay.jsonv2.payment.error', error)
    log.info('pay.jsonv2.payment.error', { error: error.message })

    return badRequest({ error: error.message })

  }

}

