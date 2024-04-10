/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
import { publish } from 'rabbi'

import {
  invoices as Invoice,
  payments as Payment
} from '@prisma/client'

import { getConfirmation } from './plugins'

import * as moment from 'moment'
import { registerSchema } from './amqp'
import prisma from './prisma'

import { createAndSendWebhook } from './webhooks'

import PaymentConfirmedEvent from '../src/webhooks/schemas/PaymentConfirmedEvent'

export interface Confirmation {
  confirmation_hash: string;
  confirmation_height: number;
  confirmation_date: Date;
  confirmations?: number;
}

export async function confirmPayment({payment, confirmation}: {payment: Payment, confirmation: Confirmation}): Promise<Payment> {

  const { confirmation_hash, confirmation_height, confirmation_date } = confirmation

  if (payment.confirmation_hash) {

    // Payment already confirmed

    return payment;

  }

  await prisma.payments.update({
    where: { id: payment.id },
    data: {
      confirmation_hash,
      confirmation_height,
      confirmation_date,
      status: 'confirmed'
    }
  })

  payment = await prisma.payments.findFirstOrThrow({
    where: {
      id: payment.id
    }
  })

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: { uid: payment.invoice_uid }
  })

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'paid'
    }
  })

  publish('payment.confirmed', payment)

  const webhookPayload: PaymentConfirmedEvent = {
    topic: 'payment.confirmed',
    payload: {
      account_id: invoice.account_id || undefined,
      app_id: invoice.app_id || undefined,
      payment: {
        chain: String(payment.chain),
        currency: payment.currency,
        txid: payment.txid,
        status: String(payment.status),
      },
      invoice: {
        uid: String(invoice.uid),
        status: String(invoice.status)
      },
      confirmation: {
        hash: confirmation_hash,
        height: confirmation_height
      }
    }      
  }

  await createAndSendWebhook('payment.confirmed', webhookPayload)

  return payment

}

export async function getConfirmationForTxid({ txid }: { txid: string }): Promise<Payment | undefined> {

  const payment = await prisma.payments.findFirst({
    where: { txid }
  })

  if (!payment) { return }

  const chain = String(payment.chain)

  const currency = String(payment.currency)

  const confirmation = await getConfirmation({ txid, chain, currency })

  console.log({ confirmation })

  if (!confirmation) { return }

  return confirmPayment({ payment, confirmation })

}

export async function confirmPaymentByTxid({txid, confirmation}: {txid: string, confirmation: Confirmation}): Promise<Payment> {

  const payment = await prisma.payments.findFirstOrThrow({
    where: { txid }
  
  })

  return confirmPayment({ payment, confirmation })

}

interface RevertedPayment {
  invoice: Invoice;
  payment: Payment;
}

import PaymentFailedEvent from '../src/webhooks/schemas/PaymentFailedEvent'

registerSchema('payment.failed', PaymentFailedEvent)

export async function revertPayment({ txid }: { txid: string }): Promise<RevertedPayment> {

  // Transaction was reverted by EVM! 
  // Mark the payment as failed
  // Mark the invoice as unpaid

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      hash: txid
    }
  })

  let payment = await prisma.payments.findFirstOrThrow({
    where: {
      txid
    }
  })

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'unpaid',
      hash: null,
    }
  })

  await prisma.payments.update({
    where: { id: payment.id },
    data: {
      status: 'failed'
    }
  })

  payment = await prisma.payments.findFirstOrThrow({
    where: { id: payment.id }
  })

  publish('payment.reverted', {payment, invoice})

  return { invoice, payment }
}


export async function listUnconfirmedPayments({chain, currency}: {chain: string, currency: string}): Promise<Payment[]> {

  return prisma.payments.findMany({
    where: {
      confirmation_hash: null,
      chain,
      currency
    }
  
  })

}

export async function startConfirmingTransactions() {

  return setInterval(async () => {

    try {

      const unconfirmed = await prisma.payments.findMany({

        where: {
          status: 'confirming',
          createdAt: {
            gte: moment().subtract(7, 'days').toDate()
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      for (let payment of unconfirmed) {

        try {

          const { chain, currency, txid } = payment as {
            chain: string;
            currency: string;
            txid: string;
          }

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

