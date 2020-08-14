
import { plugins, models, amqp } from '../../../lib'

import { verifyPayment } from '../../../lib/pay';

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

export async function submitPayment(payment: SubmitPaymentRequest): Promise<SubmitPaymentResponse> {

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

    console.log(`jsonv2.${payment.currency.toLowerCase()}.submittransaction.response`, resp)

    let payments = await plugin.transformHexToPayments(transaction)

    let channel = await amqp.awaitChannel()

    for (let payment of payments) {

      channel.publish('anypay.payments', 'payment', Buffer.from(
        JSON.stringify(Object.assign(payment, {
          invoice_uid: payment.invoice_uid
        }))
      ))

      channel.publish('anypay.router', 'transaction.bsv', Buffer.from(
        JSON.stringify({ transaction })
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

    let transactions = req.payload.transaction;

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

