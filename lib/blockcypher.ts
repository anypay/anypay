
import axios from 'axios'

let token = process.env.blockcypher_token;

import { log } from './log';

import { v4 as uuid } from 'uuid'

import { BroadcastTxResult } from './plugins';

import { config } from './config';

import {models} from './models';

import { publish as publishAMQP } from 'rabbi'

import { Op } from 'sequelize'
import { sendWebhookForInvoice } from './webhooks';

export async function publish(currency, hex): Promise<BroadcastTxResult> {

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

  } catch(error) {

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
    secret: process.env.blockcypher_webhook_secret
  })

  console.log('blockcypher.createNewBlockWebhook.response', data)

  return data

}

export async function getNewBlockWebhook() {  

  let { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`)

  console.log('blockcypher.createNewBlockWebhook.response', data)

  return data.filter(hook => hook.event === 'new-block')[0]

}

export async function deleteNewBlockWebhook() {

  const webhook = await getNewBlockWebhook()

  console.log(webhook)

  if (!webhook) return

  let { data } = await axios.delete(`https://api.blockcypher.com/v1/btc/main/hooks/${webhook.id}?token=${token}`)

  console.log('blockcypher.createNewBlockWebhook.response', data)

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
}

export async function getTransaction(txid: string): Promise<GetTransactionResult > {

  let { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/txs/${txid}`)

  log.info('blockcypher.getTransaction.response', data)

  return data

}

export async function confirmTransaction(payment, transaction?: GetTransactionResult) {

  if (!transaction) {

    transaction = await getTransaction(payment.txid)

  }

  payment.confirmation_date = transaction.confirmed

  payment.confirmation_height = transaction.block_height

  payment.confirmation_hash = transaction.block_hash

  payment.status = 'confirmed'

  await payment.save()

  publishAMQP('anypay', 'payment.confirmed', payment.toJSON())

  const invoice = await models.Invoice.findOne({
    where: {
      uid: payment.invoice_uid
    }
  })

  const originalStatus = invoice.status

  if (originalStatus === 'confirming') {

    invoice.status = 'paid'

    await invoice.save()

    publishAMQP('anypay', 'invoice.paid', invoice.toJSON())

  }

  invoice.status = 'paid'

  await invoice.save()

  sendWebhookForInvoice(invoice.uid, 'confirmTransaction')

  return payment
  
}

export async function confirmTransactionsFromBlock(hash: string) {

  var newTransactions: string[];

  var offset = 0

  const confirmed = []

  while (!newTransactions || newTransactions.length > 0) {

    const { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/blocks/${hash}?txstart=${offset}&limit=500`)

    offset += 500

    const { txids } = data

    newTransactions = txids
  
    console.log(`${txids.length} transactions in block ${hash}`)
  
    const payments = await models.Payment.findAll({
      where: {
        txid: {
          [Op.in]: txids
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

export async function confirmTransactionsFromBlockWebhook(webhook) {

  return confirmTransactionsFromBlock(webhook.hash)
  
}
