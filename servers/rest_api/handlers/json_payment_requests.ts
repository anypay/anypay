
import { plugins, models, amqp, log } from '../../../lib'

import { verifyPayment, buildPaymentRequest, completePayment, getCurrency } from '../../../lib/pay';

import * as Hapi from 'hapi';

import * as Boom from 'boom';

export interface SubmitPaymentRequest {
  currency: string;
  invoice_uid: string;
  transactions: string[];
}

export interface SubmitPaymentResponse {
  success: boolean;
  transactions: string[];
}

export async function show(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id
  }});

  let currency = getCurrency({
    headers: req.headers,
    protocol: 'JSONV2'
  })

  log.info(`paymentrequest.jsonv2`, {
    currency: currency.code,
    invoice_uid: invoice.uid
  })


  let paymentOption = await models.PaymentOption.findOne({

    where: {

      invoice_uid: req.params.uid,

      currency

    }
  });

  if (!paymentOption) {
    return Boom.notFound();
  }

  const paymentRequest = await buildPaymentRequest(Object.assign(paymentOption, { protocol: 'JSONV2' }));

  let response = h.response(paymentRequest);

  response.type('application/payment-request');

  response.header('Content-Type', 'application/payment-request');

  response.header('Accept', 'application/payment');

  return response;
}

export async function submitPayment(payment: SubmitPaymentRequest): Promise<SubmitPaymentResponse> {

  log.info('payment.submit', payment);

  let invoice = await models.Invoice.findOne({ where: { uid: payment.invoice_uid }})

  if (!invoice) {
    throw new Error(`invoice ${payment.invoice_uid} not found`)
  }

  let payment_option = await models.PaymentOption.findOne({ where: {
    invoice_uid: invoice.uid,
    currency: payment.currency
  }})

  if (!payment_option) {
    throw new Error(`${payment.currency} payment option not found for invoice l${payment.invoice_uid}`)
  }

  let plugin = await plugins.findForCurrency(payment.currency)

  for (const transaction of payment.transactions) {

    await verifyPayment({
      payment_option,
      hex: transaction,
      protocol: 'JSONV2'
    })

    console.log(`jsonv2.${payment.currency.toLowerCase()}.submittransaction`, transaction)

    let resp = await plugin.broadcastTx(transaction)

    console.log(`jsonv2.${payment.currency.toLowerCase()}.submittransaction.success`)

    console.log('COMPLETE PAYMENT')

    let paymentRecord = await completePayment(payment_option, transaction)

    console.log('payment completed', paymentRecord);

    return {
      success: true,
      transactions: payment.transactions
    }
  }

}

export async function create(req, h) {

  const currency = req.params.currency.toUpperCase()

  try {

    let invoice_uid = req.params.uid

    let transactions = req.payload.transactions;

    let response = await submitPayment({
      currency,
      invoice_uid,
      transactions
    })

    return response

  } catch(error) {

    console.error(`jsonv2.${currency.toLowerCase()}.submittransaction.error`, error)

    return Boom.badRequest(error)

  }

}

