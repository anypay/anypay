
import { Payment } from './payments'

import { Invoice } from './invoices'

import { findOne, findAll } from './orm'

import { publish } from 'rabbi'

import { Op } from 'sequelize'

import { getConfirmation } from './plugins'

export interface Confirmation {
  confirmation_hash: string;
  confirmation_height: number;
  confirmation_date: Date;
  confirmations?: number;
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

    confirmation_date,

    status: 'confirmed'

  })

  let invoice = await findOne<Invoice>(Invoice, {
    where: {
      uid: payment.get('invoice_uid')
    } 
  })

  await invoice.set('status', 'paid')

  publish('anypay', 'payment.confirmed', payment.toJSON())

  return payment

}

export async function getConfirmationForTxid({ txid }: { txid: string }): Promise<Payment | null> {

  let payment = await findOne<Payment>(Payment, {
    where: { txid }
  })

  if (!payment) { return }

  const { chain, currency } = payment

  const confirmation = await getConfirmation({ txid, chain, currency })

  console.log({ confirmation })

  if (!confirmation) { return }

  return confirmPayment({ payment, confirmation })

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


export async function listUnconfirmedPayments({chain, currency}: {chain: string, currency: string}): Promise<Payment[]> {

  return findAll<Payment>(Payment, {
    where: {
      confirmation_hash: {
        [Op.eq]: null
      },
      chain,
      currency
    }
  })

}

export async function startConfirmingTransactions() {

  return setInterval(async () => {

    try {

      const unconfirmed = await findAll<Payment>(Payment, {
        where: {
          confirmation_hash: {
            [Op.eq]: null
          }
        },
        order: [['createdAt', 'desc']]
      })

      for (let payment of unconfirmed) {

        try {

          const { chain, currency, txid } = payment

          const confirmation = await getConfirmation({ txid, chain, currency })

          console.log({ confirmation })

          if (!confirmation) { continue }

          await confirmPayment({ payment, confirmation })

        } catch(error) {

          console.error(error)

        }

      }

    } catch(error) {

      console.error(error)

    }

  }, 1000 * 60)

}

