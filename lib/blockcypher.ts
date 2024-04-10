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

import axios from 'axios'


import { log } from './log';

import { v4 as uuid } from 'uuid'

import { BroadcastTxResult } from './plugin';

import { config } from './config';

import { publish as publishAMQP } from 'rabbi'

import { sendWebhookForInvoice } from './webhooks';

import { registerSchema } from './amqp';

const token = config.get('BLOCKCYPHER_TOKEN');

import {
  payments as Payment
} from '@prisma/client'
import prisma from './prisma';
import InvoicePaidEvent from '../src/webhooks/schemas/InvoicePaidEvent';

export async function publish(currency: string, hex: string): Promise<BroadcastTxResult> {

  const trace = uuid()

  log.info('blockcypher.publish', { currency, hex, trace })
  
  try {

    let response = await axios.post(`https://api.blockcypher.com/v1/${currency}/main/txs/push?token=${token}`, {
      tx: hex
    });

    const { data } = response

    log.info('blockcypher.publish.response', { trace, data })

    return {
      result: data,
      success: true,
      txid: data.tx.hash,
      txhex: hex
    }

  } catch(error: any) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('blockcypher.publish.error', error)

    throw error;

  }

}

export async function createNewBlockWebhook() {

  let { data } = await axios.post(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`, {
    event: 'new-block',
    url: `${config.get('API_BASE')}/api/v1/blockcypher/webhooks`,
    secret: config.get('BLOCKCYPHER_WEBHOOK_TOKEN')
  })

  return data

}

export async function getNewBlockWebhook() {  

  let { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`)

  return data.filter((hook: { event: string; }) => hook.event === 'new-block')[0]

}

export async function deleteNewBlockWebhook() {

  const webhook = await getNewBlockWebhook()

  if (!webhook) return

  let { data } = await axios.delete(`https://api.blockcypher.com/v1/btc/main/hooks/${webhook.id}?token=${token}`)

  return data

}

interface BlockchainStatus {
  name: string;
  height: number;
  hash: string;
  time: string;
  latest_url: string;
  previous_hash: string;
  previous_url: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}

export async function getBlockchain(): Promise<BlockchainStatus> {

  const { data } = await axios.get('https://api.blockcypher.com/v1/btc/main')

  return data
}

interface GetTransactionResult { 
  block_hash: string;
  block_height: number;
  confirmed: Date;
  confirmations?: number;
}

export async function getTransaction(chain: string, txid: string): Promise<GetTransactionResult > {

  if (chain === 'BCH') { chain = 'bitcoin-cash' }

  let { data } = await axios.get(`https://api.blockcypher.com/v1/${chain.toLowerCase()}/main/txs/${txid}`)

  log.info('blockcypher.getTransaction.response', data)

  return data

}

registerSchema('invoice.paid', InvoicePaidEvent)

export async function confirmTransaction(payment: Payment, transaction?: GetTransactionResult) {

  if (!transaction) {

    transaction = await getTransaction(payment.currency, payment.txid)

  }

  prisma.payments.update({
    where: { id: payment.id },
    data: {
      status: 'confirmed',
      confirmation_date: transaction.confirmed,
      confirmation_height: transaction.block_height,
      confirmation_hash: transaction.block_hash
    }
  })

  const updatedPayment = await prisma.payments.findFirstOrThrow({
    where: { id: payment.id }
  })

  publishAMQP('payment.confirmed', updatedPayment)

  let invoice = await prisma.invoices.findFirstOrThrow({
    where: { uid: payment.invoice_uid }
  })

  const originalStatus = invoice.status


  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'paid'
    }
  })

  invoice = await prisma.invoices.findFirstOrThrow({
    where: { id: invoice.id }
  })

  if (originalStatus === 'confirming') {

    publishAMQP('invoice.paid', invoice)

  }

  sendWebhookForInvoice(String(invoice.uid), 'confirmTransaction')

  return payment
  
}

export async function confirmTransactionsFromBlock(hash: string) {

  var newTransactions: string[] | null = null;

  var offset = 0

  const confirmed = []

  while (!newTransactions || newTransactions.length > 0) {

    const { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/blocks/${hash}?txstart=${offset}&limit=500`)

    offset += 500

    const { txids } = data

    newTransactions = txids

    const payments = await prisma.payments.findMany({
      where: {
        txid: {
          in: txids
        }
      }
    })
  
    for (let payment of payments) {
  
      const updated = await confirmTransaction(payment, {
        confirmed: data.time,
        block_height: data.height,
        block_hash: data.hash
      })
  
      confirmed.push(updated)
  
    }
  
  }

  return confirmed

}

interface BlockcypherWebhook {
  hash: string;
}

export async function confirmTransactionsFromBlockWebhook(webhook: BlockcypherWebhook) {

  return confirmTransactionsFromBlock(webhook.hash)
  
}
