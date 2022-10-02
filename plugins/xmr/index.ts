
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { log } from '../../lib'

export { bitcore }

import axios from 'axios'

import { Client } from 'payment-protocol'

import { config } from '../../lib/config'

import { v4 as uuid } from 'uuid'
import { Transaction, Tx } from '../../lib/pay/json_v2/protocol'

export async function validateAddress(): Promise<Boolean> {

  return true

}

export async function validateUnsignedTx(): Promise<Boolean> {

  return true

}


export async function broadcastTx({ tx, tx_hash, tx_key }: Tx): Promise<SendRawTransactionResult> {

  let result = await send_raw_transaction({ tx_as_hex: tx, do_not_relay: false })

  if (result.sanity_check_failed) {
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

  if (result.status !== 'OK') {
    throw new Error(result.reason)
  }

  return result

}

interface SendRawTransaction {
  tx_as_hex,
  do_not_relay
}

interface SendRawTransactionResult {
  credits: number;
  double_spend: boolean;
  fee_too_low: boolean;
  invalid_input: boolean;
  invalid_output: boolean;
  low_mixin: boolean;
  not_relayed: boolean;
  overspend: boolean;
  reason: string;
  sanity_check_failed: boolean,
  status: string;
  too_big: boolean;
  too_few_outputs: boolean;
  top_hash: string;
  untrusted: boolean;
}

export async function send_raw_transaction({tx_as_hex, do_not_relay}: SendRawTransaction): Promise<SendRawTransactionResult> {

  log.info('plugins.xmr.send_raw_transaction', { tx_as_hex, do_not_relay })

  let { data } = await axios.post(`${process.env.XMR_RPC_URL}/send_raw_transaction`, {
    tx_as_hex,
    do_not_relay
  })

  log.info('plugins.xmr.send_raw_transaction.result', Object.assign(data, {tx_as_hex}))

  return data

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
      username: process.env.XMR_RPC_USER,
      password: process.env.XMR_RPC_PASSWORD
    }
  })

  log.info('xmr.rpc.call.result', { method, params, data, trace })

  return data.result

}

export async function callWalletRpc(method: string, params: any): Promise<any> {

  const trace = uuid()

  log.info('xmr.monero_wallet_rpc.call', { method, params, trace })

  let response = await axios.post(config.get('monero_wallet_rpc_url'), {
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

  return call('transfer', {
    get_tx_hex: true,
    get_tx_key: true,
    get_tx_metadata: true,
    do_not_relay: true,
    destinations
  })

}

interface VerifyPayment {
  url: string;
  tx_hash: string;
  tx_key: string;
}

interface Verify {
  payment_option: any;
  transaction: Transaction;
}

export async function verifyPayment({payment_option, transaction}: Verify): Promise<boolean> {

  const { tx, tx_key, tx_hash } = transaction

  let result = await send_raw_transaction({ tx_as_hex: tx, do_not_relay: true })

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

  const { invoice_uid } = payment_option

  const url = `${config.get('api_base')}/i/${payment_option.invoice_uid}`

  log.info('xmr.verifyPayment', {invoice_uid, payment_option, tx, tx_key, tx_hash, url })

  await verify({
    url,
    tx_hash: String(tx_hash),
    tx_key: String(tx_key)
  })

  return true

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

export async function verify({url, tx_hash, tx_key}: VerifyPayment) {

  let client = new Client(url)

  let paymentRequest = await client.paymentRequest({
    chain: 'XMR',
    currency: 'XMR'
  })

  let destinations = paymentRequest.instructions[0].outputs

  for (let { address, amount } of destinations) {

    log.info('xmr.check_tx_key', { txid: tx_hash, tx_key, address })

    let result = await callWalletRpc('check_tx_key', { txid: tx_hash, tx_key, address })

    log.info('xmr.check_tx_key.result', result)

    if (amount !== result.received) {
      throw new Error('Invalid XMR Payment')
    }
  }

  return
}
