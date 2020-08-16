
import { plugins, models, amqp } from '../../../lib'

import { verifyPayment, buildPaymentRequest } from '../../../lib/pay';

import * as Hapi from 'hapi';

import * as Boom from 'boom';

interface SubmitPaymentRequest {
  currency: string;
  invoice_uid: string;
  transactions: string[];
}

interface SubmitPaymentResponse {
  success: boolean;
  transactions: string[];
}

export async function handleJsonV2(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }});

  let account = await models.Account.findOne({ where: {

    id: invoice.account_id
  }});

  let currency = req.headers['x-currency'];

  if (!currency) {
    //throw new Error('x-currency header must be provided with value such as BCH,DASH,BSV,BTC')
    currency = 'BCH'
  }

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

  console.log('SUBMIT PAYMENT', payment);

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

    let payments = await plugin.transformHexToPayments(transaction)

    let channel = await amqp.awaitChannel()

    for (let p of payments) {

      if (p.address.match(':')) {
        p.address = p.address.split(':')[1]
      }

      console.log('PAYMENT', Object.assign(p, {
        invoice_uid: invoice.uid
      }))

      channel.publish('anypay.payments', 'payment', Buffer.from(
        JSON.stringify(Object.assign(p, {
          invoice_uid: invoice.uid
        }))
      ))

    }

    return {
      success: true,
      transactions: payment.transactions
    }
  }

}

export async function submitJsonV2(req, h) {

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

