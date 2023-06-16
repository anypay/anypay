
import { Payment } from './payments'

import { Invoice } from './invoices'

import { findOne } from './orm'

import { publish } from 'rabbi'

interface Confirmation {
  confirmation_hash: string;
  confirmation_height: number;
  confirmation_date: Date;
}

export async function confirmPayment({payment, confirmation}: {payment: Payment, confirmation: Confirmation}): Promise<Payment> {

  const { confirmation_hash, confirmation_height, confirmation_date } = confirmation

  if (payment.get('confirmation_hash')) {

    // Payment already confirmed

    return payment;

  }

  await payment.update({

    confirmation_hash,

    confirmation_height,

    confirmation_date

  })

  publish('anypay', 'payment.confirmed', payment.toJSON())

  return payment

}

export async function confirmPaymentByTxid({txid, confirmation}: {txid: string, confirmation: Confirmation}): Promise<Payment> {

  let payment = await findOne<Payment>(Payment, {
    where: { txid }
  })

  if (!payment) { throw new Error(`Payment not found for txid ${txid}`) }

  return confirmPayment({ payment, confirmation })

}

interface RevertedPayment {
  invoice: Invoice;
  payment: Payment;
}

export async function revertPayment({ txid }: { txid: string }): Promise<RevertedPayment> {

  // Transaction was reverted by EVM! 
  // Mark the payment as failed
  // Mark the invoice as unpaid

  const invoice = await findOne<Invoice>(Invoice, { where: { hash: txid }})

  const payment = await findOne<Payment>(Payment, { where: { txid }})

  await invoice.set('status', 'unpaid')

  await invoice.set('hash', null)

  await payment.set('status', 'failed')

  publish('anypay', 'payment.revered', payment.toJSON())

  return { invoice, payment }
}

