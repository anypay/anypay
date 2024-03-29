const base58Monero = require('base58-monero')
export const currency = 'XMR'

import {
  Plugin,
  VerifyPayment,
  Confirmation,
  BroadcastTx,
  BroadcastTxResult,
  Transaction,
  Payment as AnypayPayment,
  ValidateUnsignedTx
} from '../../lib/plugin'

import * as bitcore from './bitcore'

import { log } from '../../lib'

export { bitcore }

import axios from 'axios'

import { payments as Payment } from '@prisma/client'

//@ts-ignore
import { Client } from 'payment-protocol'

import { config } from '../../lib/config'

import { v4 as uuid } from 'uuid'

import { other_rpc } from './json_rpc'

import { Invoice } from '../../lib/invoices'

import { getPayment } from '../../lib/payments'

import get_block from './json_rpc/get_block'

import get_block_count from './json_rpc/get_block_count'

export default class XMR extends Plugin {

  chain = 'XMR'

  currency = 'XMR'

  decimals = 12

  async parsePayments({txhex}: Transaction): Promise<AnypayPayment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<AnypayPayment[]> {
    throw new Error() //TODO
  }


  async getConfirmation(txid: string): Promise<Confirmation | null> {

    const transaction = await getTransaction(txid)

    if (!transaction.block_height) { return null }

    const height = transaction.block_height

    const timestamp = new Date(transaction.block_timestamp * 1000)

    const block = await get_block({ height: transaction.block_height })

    if (!block) { return null  }

    const hash = block.block_header.hash

    const { count } = await get_block_count()

    return {
      confirmation_hash: hash,
      confirmation_height: height,
      confirmation_date: timestamp,
      confirmations: count - height + 1
    }

  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return verifyPayment(params)

  }

  async getTransaction(txid: string): Promise<Transaction> {

    //TODO
    throw new Error()

  }

  async validateAddress(address: string): Promise<boolean> {
    const chain = {
      "name": "XMR",
      "publicAddressBytes": [
        18
      ],
    };

    const validateCryptonote = (address: string, chain: any) => {
      const {publicAddressBytes} = chain

      if (!publicAddressBytes || !Array.isArray(publicAddressBytes) && publicAddressBytes.length) {
        throw new Error('Array of numbers accepted for network bytes are accepted')
      }

      if (address.length !== 95 + ((publicAddressBytes.length - 1) * 2)) {
        throw new Error('Invalid address length')
      }

      const buffer = base58Monero.decode(address)

      if ((buffer.length !== (69 + publicAddressBytes.length - 1))) {
        throw new Error('Invalid address buffer length')
      }

      if (buffer.slice(0, publicAddressBytes.length).compare(Buffer.from(publicAddressBytes)) !== 0) {
        throw new Error('Invalid network bytes')
      }
    }


    try {
      validateCryptonote(address, String(chain))

      return true
    } catch (e) {
      return false
    }
  }

  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> {

    console.log('VALIDATE UNSIGNED', params)

    //TODO
    return true

  }

  async broadcastTx({ txhex, txid, txkey }: BroadcastTx): Promise<BroadcastTxResult> {

    console.log('BROADCAST TX', { txhex, txid, txkey })

    const result: any = await send_raw_transaction({ tx_as_hex: txhex, do_not_relay: false })

    if (result['sanity_check_failed']) {
      throw new Error(result.reason)
    }

    if (result.double_spend) {
      throw new Error('double spend')
    }

    if (result.too_big) {
      throw new Error('too big')
    }

    if (result.status === 'Failed') {
      throw new Error(result.reason)
    }

    return {
      txhex,
      txid: String(txid),
      success: true,
      result
    }

  }

}

import { default as pool_send_raw_transaction, Outputs as SendRawTransactionResult, Inputs as SendRawTransaction } from './other_rpc/send_raw_transaction'
import prisma from '../../lib/prisma'
//import submit_transfer from './wallet_rpc/submit_transfer'

export async function send_raw_transaction({tx_as_hex, do_not_relay}: SendRawTransaction): Promise<SendRawTransactionResult> {

  log.info('plugins.xmr.send_raw_transaction', { tx_as_hex, do_not_relay })

  const result = await pool_send_raw_transaction({
    tx_as_hex,
    do_not_relay
  })

  log.info('plugins.xmr.send_raw_transaction.result', result)

  return result

}

export async function call(method: string, params: any): Promise<any> {

  const trace = uuid()

  const url = config.get('XMR_RPC_URL')

  log.info('xmr.rpc.call', { url, method, params, trace })

  let { data } = await axios.post(url, {
    jsonrpc:"2.0",
    id:"0",
    method,
    params
  }, {
    auth: {
      username: config.get('XMR_RPC_USER'),
      password: config.get('XMR_RPC_PASSWORD')
    }
  })

  log.info('xmr.rpc.call.result', { method, params, data, trace })

  return data.result

}

export async function callWalletRpc(method: string, params: any): Promise<any> {

  const trace = uuid()

  log.info('xmr.monero_wallet_rpc.call', { method, params, trace })

  let response = await axios.post(config.get('MONERO_WALLET_RPC_URL'), {
    jsonrpc:"2.0",
    id:"0",
    method,
    params
  })

  const { data } = response

  log.info('xmr.monero_wallet_rpc.result', data)

  const { result } = data

  log.info('xmr.monero_wallet_rpc.response', { method, params, result, trace })

  return data.result

}

interface Destination {
  address: string;
  amount: number;
}

export async function transfer(destinations: Destination[]) {

  log.info('xmr.transfer', { destinations })

  return call('transfer', {
    get_tx_hex: true,
    get_tx_key: true,
    get_tx_metadata: true,
    //TODO: switch back -> do_not_relay: true,
    do_not_relay: false,
    destinations
  })

}

interface XMRVerifyPayment {
  url: string;
  tx_hash: string;
  tx_key: string;
}


interface Txn {
  as_hex: string;
  as_json: string;
  block_height: number;
  block_timestamp: number;
  double_spend_seen: boolean;
  in_pool: boolean;
  output_indices: number[];
  pruable_as_hex: string;
  prunable_hash: string;
  pruned_as_hex: string;
  tx_hash: string;
}

interface GetTransactionsResponse {
  credits: number;
  status: string;
  top_hash: string;
  txs: Txn[];
  txs_as_hex: string[];
  untrusted: boolean;
}

export async function check_confirmations(invoice: Invoice): Promise<[Payment, boolean]> {

  const payment = await getPayment(invoice)

  if (!payment) {

    throw new Error('payment not found')
  }

  if (payment.confirmation_height && payment.confirmation_date) {

    return [payment, true];
  }

  const transaction = await getTransaction(payment.txid)

  if (transaction.block_height && transaction.block_height > 0) {

    const { block_header, tx_hashes } = await get_block({ height: transaction.block_height })

    if (!tx_hashes.includes(payment.txid)) {

      throw new Error('Payment Not In Block')

    }

    await prisma.payments.update({
      where: {
        id: payment.id
      },
      data: {
        confirmation_height: transaction.block_height,
        confirmation_date: new Date(transaction.block_timestamp * 1000),
        confirmation_hash: block_header.hash

      }
    })

    log.info('payment.confirmation', {

      invoice_uid: invoice.uid,

      confirmation_height: payment.confirmation_height,

      confirmation_date: payment.confirmation_date,

      confirmation_hash: block_header.hash

    })

    return [payment, true]

  } else {

    log.info('payment.unconfirmed', {

      invoice_uid: invoice.uid,

      txid: payment.txid,

      currency: payment.currency

    })

    return [payment, false]

  }

}

export async function getTransactions(txids: string[]): Promise<GetTransactionsResponse> {

  const response = await other_rpc.call<GetTransactionsResponse>('/get_transactions', {

    txs_hashes: txids,

    decode_as_json: false

  })

  return response

}


export async function getTransaction(txid: string): Promise<Txn> {

  const response = await other_rpc.call<GetTransactionsResponse>('/get_transactions', {

    txs_hashes: [txid],

    decode_as_json: false

  })

  return response.txs[0]

}


export async function verifyPayment({paymentOption, transaction}: VerifyPayment): Promise<boolean> {

  /*

  const { tx, tx_key, tx_hash } = transaction

  let result = await send_raw_transaction({ tx_as_hex: tx, do_not_relay: false })

  if (result.double_spend) {
    throw new Error('double spend')
  }

  if (result.too_big) {
    throw new Error('too big')
  }

  if (result.status === 'Failed') {
    throw new Error(result.reason)
  }

  if (result.status !== 'OK') {
    throw new Error(result.reason)
  }

  */

  ;(async () => {

    try {

      const { invoice_uid } = paymentOption

      const url = `${config.get('api_base')}/i/${paymentOption.invoice_uid}`

      log.info('xmr.verifyPayment', {
        invoice_uid,
        paymentOption,
        txhex: transaction.txhex,
        txkey: transaction.txkey,
        txid: transaction.txid,
        url
      })

      await verify({
        url,
        tx_hash: String(transaction.txid),
        tx_key: String(transaction.txkey)
      })

    } catch(error: any) {

      log.error('xmr.verifyPayment.error', error)

    }

  })();

  return true;

}

interface CheckTxKey {
  tx_hash: string;
  tx_key: string;
  address: string;
}

interface CheckTxKeyResult {
  confirmations: number;
  in_pool: boolean;
  received: number;
}

export async function check_tx_key(params: CheckTxKey): Promise<CheckTxKeyResult> {

  const result = await callWalletRpc('check_tx_key', params)

  return result

}

export async function verify({url, tx_hash, tx_key}: XMRVerifyPayment) {

  let client = new Client(url)

  let paymentRequest = await client.paymentRequest({
    chain: 'XMR',
    currency: 'XMR'
  })

  let destinations = paymentRequest.instructions[0].outputs

  for (let { address, amount } of destinations) {

    log.info('xmr.check_tx_key', { txid: tx_hash, tx_key, address })

    let result = await callWalletRpc('check_tx_key', { txid: tx_hash, tx_key, address })

    log.info('xmr.check_tx_key.result', Object.assign(result, { expected: amount }))

    if (amount > result.received) {
      throw new Error(`Invalid XMR Payment received=${result.received} expected=${amount}`)
    }
  }

  return
}
