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

import { getConfirmation } from '@/lib/plugins'

import moment from 'moment'
import { registerSchema } from '@/lib/amqp'
import prisma from '@/lib/prisma'

import { createAndSendWebhook } from '@/lib/webhooks'

import PaymentConfirmedEvent from '@/webhooks/schemas/PaymentConfirmedEvent'

import PaymentFailedEvent from '@/webhooks/schemas/PaymentFailedEvent'

import { log } from '@/lib/log'

/**
 * Represents a blockchain confirmation for a transaction
 * @interface Confirmation
 */
export interface Confirmation {
  /** Hash of the block containing the transaction */
  confirmation_hash: string;
  /** Block height/number of the confirmation */
  confirmation_height: number;
  /** Timestamp when confirmation occurred */
  confirmation_date: Date;
  /** Number of confirmations (optional) */
  confirmations?: number;
}

/**
 * Updates a payment record with confirmation details and marks it as confirmed
 * Also updates the associated invoice and sends webhook notifications
 * 
 * @param {Object} params - Parameters object
 * @param {Payment} params.payment - The payment record to confirm
 * @param {Confirmation} params.confirmation - The confirmation details
 * @returns {Promise<Payment>} The updated payment record
 */
export async function confirmPayment({payment, confirmation}: {payment: Payment, confirmation: Confirmation}): Promise<Payment> {
  log.info('Confirming payment', { paymentId: payment.id, confirmation })

  const { confirmation_hash, confirmation_height, confirmation_date } = confirmation

  if (payment.confirmation_hash) {
    log.info('Payment already confirmed', { paymentId: payment.id })
    return payment;
  }

  // Update payment record with confirmation details
  log.debug('Updating payment record', { paymentId: payment.id })
  await prisma.payments.update({
    where: { id: payment.id },
    data: {
      confirmation_hash,
      confirmation_height,
      confirmation_date,
      status: 'confirmed'
    }
  })

  // Fetch updated payment record
  payment = await prisma.payments.findFirstOrThrow({
    where: {
      id: payment.id
    }
  })
  log.debug('Payment record updated', { payment })

  // Update associated invoice
  const invoice = await prisma.invoices.findFirstOrThrow({
    where: { uid: payment.invoice_uid }
  })
  log.debug('Found associated invoice', { invoiceId: invoice.id })

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'paid'
    }
  })

  // Publish confirmation event
  publish('payment.confirmed', payment)
  log.info('Published payment.confirmed event')

  // Prepare and send webhook
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
        uid: invoice.uid,
        status: invoice.status
      },
      confirmation: {
        hash: confirmation_hash,
        height: confirmation_height
      }
    }      
  }

  await createAndSendWebhook('payment.confirmed', webhookPayload)
  log.info('Sent confirmation webhook')

  return payment
}

/**
 * Fetches confirmation details for a transaction and confirms the payment if found
 * 
 * @param {Object} params - Parameters object
 * @param {string} params.txid - Transaction ID to check
 * @returns {Promise<Payment|undefined>} The confirmed payment or undefined if not found/confirmed
 */
export async function getConfirmationForTxid({ txid }: { txid: string }): Promise<Payment | undefined> {
  log.info('Getting confirmation for txid', { txid })

  const payment = await prisma.payments.findFirst({
    where: { txid }
  })

  if (!payment) {
    log.debug('No payment found for txid', { txid })
    return
  }

  const chain = String(payment.chain)
  const currency = String(payment.currency)

  log.debug('Fetching confirmation from chain', { chain, currency, txid })
  const confirmation = await getConfirmation({ txid, chain, currency })

  if (!confirmation) {
    log.debug('No confirmation found yet', { txid })
    return
  }

  return confirmPayment({ payment, confirmation })
}

/**
 * Confirms a payment using a provided confirmation object
 * 
 * @param {Object} params - Parameters object
 * @param {string} params.txid - Transaction ID of the payment
 * @param {Confirmation} params.confirmation - Confirmation details
 * @returns {Promise<Payment>} The confirmed payment
 */
export async function confirmPaymentByTxid({txid, confirmation}: {txid: string, confirmation: Confirmation}): Promise<Payment> {
  log.info('Confirming payment by txid', { txid })

  const payment = await prisma.payments.findFirstOrThrow({
    where: { txid }
  })

  return confirmPayment({ payment, confirmation })
}

/**
 * Result of reverting a payment
 * @interface RevertedPayment
 */
interface RevertedPayment {
  invoice: Invoice;
  payment: Payment;
}

registerSchema('payment.failed', PaymentFailedEvent)

/**
 * Marks a payment as failed and reverts the associated invoice
 * Used when transactions are reverted on EVM chains
 * 
 * @param {Object} params - Parameters object
 * @param {string} params.txid - Transaction ID to revert
 * @returns {Promise<RevertedPayment>} The reverted payment and invoice
 */
export async function revertPayment({ txid }: { txid: string }): Promise<RevertedPayment> {
  log.info('Reverting payment', { txid })

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      hash: txid
    }
  })
  log.debug('Found invoice to revert', { invoiceId: invoice.id })

  let payment = await prisma.payments.findFirstOrThrow({
    where: {
      txid
    }
  })
  log.debug('Found payment to revert', { paymentId: payment.id })

  // Update invoice status
  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'unpaid',
      hash: null,
    }
  })

  // Mark payment as failed
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
  log.info('Published payment.reverted event')

  return { invoice, payment }
}

/**
 * Lists all unconfirmed payments for a given chain/currency
 * 
 * @param {Object} params - Parameters object
 * @param {string} params.chain - Blockchain to check
 * @param {string} params.currency - Currency to check
 * @returns {Promise<Payment[]>} Array of unconfirmed payments
 */
export async function listUnconfirmedPayments({chain, currency}: {chain: string, currency: string}): Promise<Payment[]> {
  log.info('Listing unconfirmed payments', { chain, currency })

  return prisma.payments.findMany({
    where: {
      confirmation_hash: null,
      chain,
      currency
    }
  })
}

/**
 * Starts a background process that periodically checks for and confirms pending transactions
 * 
 * @returns {NodeJS.Timer} The interval timer
 */
export async function startConfirmingTransactions() {
  log.info('Starting confirmation monitoring process')

  return setInterval(async () => {
    try {
      // Find recent unconfirmed payments
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
      log.debug('Found unconfirmed payments', { count: unconfirmed.length })

      for (let payment of unconfirmed) {
        try {
          const { chain, currency, txid } = payment as {
            chain: string;
            currency: string;
            txid: string;
          }

          log.debug('Checking confirmation status', { chain, currency, txid })
          const confirmation = await getConfirmation({ txid, chain, currency })

          if (!confirmation) {
            log.debug('No confirmation found yet', { txid })
            continue
          }

          await confirmPayment({ payment, confirmation })
          log.info('Payment confirmed', { txid })

        } catch(error) {
          log.error('Error confirming payment', error)
        }
      }
    } catch(error) {
      log.error('Error in confirmation monitoring process', error)
    }
  }, 1000 * 60) // Run every minute
}

/**
 * Result of invoice confirmation
 * @interface ConfirmationResult
 */
interface ConfirmationResult {
  payment: Payment | null;
  confirmation: Confirmation | null;
}

/**
 * Confirms an invoice by its UID if it's in 'confirming' status
 * 
 * @param {string} uid - Invoice UID to confirm
 * @returns {Promise<ConfirmationResult>} The payment and confirmation details
 */
export async function confirmInvoice(uid: string): Promise<ConfirmationResult> {
  log.info('Confirming invoice', { uid })

  try {
    // Find invoice and its associated payment
    const invoice = await prisma.invoices.findFirstOrThrow({
      where: { uid }
    })

    // Find associated payment to get chain and currency
    const payment = await prisma.payments.findFirst({
      where: { invoice_uid: uid }
    })

    if (!payment) {
      log.info('No payment found for invoice', { uid })
      return { payment: null, confirmation: null }
    }

    // If payment is already confirmed, return existing confirmation data
    if (payment.confirmation_hash && payment.confirmation_height && payment.confirmation_date) {
      log.info('Payment already confirmed', { uid })
      const confirmation: Confirmation = {
        confirmation_hash: payment.confirmation_hash,
        confirmation_height: payment.confirmation_height,
        confirmation_date: payment.confirmation_date,
        confirmations: 1
      }
      return { payment, confirmation }
    }

    // Check if invoice is in confirming status and has a hash
    if (invoice.status !== 'confirming' || !invoice.hash) {
      log.info('Invoice not ready for confirmation', { 
        uid,
        status: invoice.status,
        hash: invoice.hash 
      })
      return { payment: null, confirmation: null }
    }

    // Get confirmation details for the transaction
    const chain = String(payment.chain)
    const currency = String(payment.currency)
    const confirmation = await getConfirmation({ 
      txid: invoice.hash,
      chain,
      currency
    })

    if (!confirmation) {
      log.info('No confirmation found for invoice', { uid, txid: invoice.hash })
      return { payment, confirmation: null }
    }

    // Confirm the payment
    const confirmedPayment = await confirmPaymentByTxid({
      txid: invoice.hash,
      confirmation
    })

    return {
      payment: confirmedPayment,
      confirmation
    }

  } catch (error) {
    log.error('Error confirming invoice', error)
    return { payment: null, confirmation: null }
  }
}

