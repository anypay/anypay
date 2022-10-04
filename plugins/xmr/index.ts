
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { log } from '../../lib'

export { bitcore }

import axios from 'axios'

import { config } from '../../lib/config'

import { v4 as uuid } from 'uuid'

import { Transaction, Tx } from '../../lib/pay/json_v2/protocol'

import { other_rpc } from './json_rpc'

import { Invoice } from '../../lib/invoices'

import { getPayment, Payment } from '../../lib/payments'

import get_block from './json_rpc/get_block'

import { oneSuccess } from 'promise-one-success'

export async function validateAddress({ value }: { value: string }): Promise<Boolean> {

  return true

}

export async function validateUnsignedTx({ tx_hex }: { tx_hex: string }): Promise<Boolean> {

  return true

}

import { BroadcastTxResult } from '../../lib/plugins'

export async function broadcastTx({ tx, tx_hash, tx_key }: Tx): Promise<BroadcastTxResult> {

  log.info('xmr.broadcastTx', { tx, tx_hash, tx_key })

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    broadcastTxWalletRPC({ tx_hex: tx, tx_id: tx_hash }),

    //broadcastTxOtherRPC({ tx_as_hex: tx, tx_id: tx_hash, do_not_relay: false })

  ]

  const result = await oneSuccess<BroadcastTxResult>(broadcastProviders)

  log.info('xmr.broadcastTx.result', { tx, tx_hash, tx_key, result })

  return result

}

export async function broadcastTxOtherRPC({ tx_as_hex, tx_id, do_not_relay }): Promise<BroadcastTxResult> {

  log.info('xmr.broadcastTxOtherRPC', {tx_as_hex, do_not_relay })

  const result = await send_raw_transaction({ tx_as_hex, do_not_relay: false })

  log.info('xmr.broadcastTxOtherRPC.result', {tx_as_hex, do_not_relay, result })

  return {
    txhex: tx_as_hex,
    txid: tx_id,
    success: true,
    result
  }
  
}

export async function broadcastTxWalletRPC({tx_hex, tx_id}: {tx_hex: string, tx_id: string}): Promise<BroadcastTxResult> {

  try {

    log.info('xmr.broadcastTxWalletRPC', {tx_hex})

    const result = await callWalletRpc('submit_transfer', {
      tx_data_hex: tx_hex
    })

    log.info('xmr.broadcastTxWalletRPC', {result, tx_hex})

    return {
      txhex: tx_hex,
      txid: tx_id,
      success: true,
      result
    }

  } catch(error) {

    console.error('xmr.broadcastTxWalletRPC.error', error)

    log.error('xmr.broadcastTxWalletRPC.error', error)

    throw error

  }
  
}

import { default as pool_send_raw_transaction, Outputs as SendRawTransactionResult, Inputs as SendRawTransaction } from './other_rpc/send_raw_transaction'

import { buildPaymentRequestForInvoice } from '../../lib/pay'

export async function send_raw_transaction({tx_as_hex, do_not_relay}: SendRawTransaction): Promise<SendRawTransactionResult> {

  log.info('plugins.xmr.send_raw_transaction', { tx_as_hex, do_not_relay })

  const result = await pool_send_raw_transaction({
    tx_as_hex,
    do_not_relay
  })

  log.info('plugins.xmr.send_raw_transaction.result', result)

  var error: Error;

  if (result.double_spend) {

    error = new Error('double spend')
  }

  if (result.too_big) {
    error = new Error('too big')
  }

  if (result.status === 'Failed') {
    error = new Error(result.reason)
  }

  if (result.status !== 'OK') {
    error = new Error(result.reason)
  }

  if (error) {

    log.error('plugins.xmr.send_raw_transaction.error', error)

    throw error

  }

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

  if ((result && result.error) || data.error) {

    const error = new Error(data.error.message)

    log.error('xmr.monero_wallet_rpc.error', error)

    throw error

  }

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
  invoice_uid: string;
  tx_hash: string;
  tx_key: string;
}

interface Verify {
  invoice_uid: string;
  transaction: Transaction;
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

  if (payment.get('confirmation_height') && payment.get('confirmation_date')) {

    return [payment, true];
  }

  const transaction = await getTransaction(payment.txid)

  if (transaction.block_height && transaction.block_height > 0) {

    const { block_header, tx_hashes } = await get_block({ height: transaction.block_height })

    if (!tx_hashes.includes(payment.txid)) {

      throw new Error('Payment Not In Block')

    }

    await payment.update({

      confirmation_height: transaction.block_height,

      confirmation_date: transaction.block_timestamp * 1000,

      confirmation_hash: block_header.hash

    })

    log.info('payment.confirmation', {

      invoice_uid: invoice.uid,

      confirmation_height: payment.get('confirmation_height'),

      confirmation_date: payment.get('confirmation_date'),

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

export async function verifyPayment({invoice_uid, transaction}: Verify): Promise<boolean> {

  return true

}

export async function _verifyPayment({invoice_uid, transaction}: Verify): Promise<boolean> {

  const { tx, tx_key, tx_hash } = transaction

  await send_raw_transaction({ tx_as_hex: tx, do_not_relay: false });

  (async () => {

    try {
    
      log.info('xmr.verifyPayment', {invoice_uid, tx, tx_key, tx_hash })
    
      let result = await verify({
        invoice_uid,
        tx_hash: String(tx_hash),
        tx_key: String(tx_key)
      })

      log.info('xmr.verifyPayment.result', result)

    } catch(error) {

      log.error('xmr.verifyPayment.error', error)

    }

  })()

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

interface Results {
  [key: string]: any;
}

export async function verify({invoice_uid, tx_hash, tx_key}: VerifyPayment): Promise<Results> {

  let { content: paymentRequest } = await buildPaymentRequestForInvoice({
    uid: invoice_uid,
    currency: 'XMR',
    protocol: 'JSONV2'
  })

  let destinations = paymentRequest.outputs

  const results = {
    outputs: [],
  }

  for (let { address, amount } of destinations) {

    log.info('xmr.check_tx_key', { txid: tx_hash, tx_key, address })

    let result = await callWalletRpc('check_tx_key', { txid: tx_hash, tx_key, address })

    log.info('xmr.check_tx_key.result', Object.assign(result, {address, tx_hash}))

    results.outputs.push({
      address,
      tx_hash,
      expected: amount,
      received: result.received,
      result
    })

    results[address] = result

    if (amount !== result.received) {
      throw new Error(`Invalid XMR Payment - Expected ${address} to receive ${amount} but it received ${result.received} - Outputs: ${destinations.length}`)
    }
  }

  log.info('xmr.verify.results', results)

  return results

}
