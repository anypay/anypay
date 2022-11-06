
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { log } from '../../lib'

export { bitcore }

import axios from 'axios'

import { Client } from 'payment-protocol'

import { config } from '../../lib/config'

import { v4 as uuid } from 'uuid'
import { Transaction, Tx } from '../../lib/pay/json_v2/protocol'
import { other_rpc } from './json_rpc'
import { Invoice } from '../../lib/invoices'
import { getPayment, Payment } from '../../lib/payments'
import get_block from './json_rpc/get_block'

export async function validateAddress({ value }: { value: string }): Promise<Boolean> {

  return true

}

export async function validateUnsignedTx({ tx_hex }: { tx_hex: string }): Promise<Boolean> {

  return true

}

export async function broadcastTx({ tx, tx_hash, tx_key }: Tx): Promise<SendRawTransactionResult> {

  const result = await send_raw_transaction({ tx_as_hex: tx, do_not_relay: false })

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
  
  return result

}

import { default as pool_send_raw_transaction, Outputs as SendRawTransactionResult, Inputs as SendRawTransaction } from './other_rpc/send_raw_transaction'
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

  console.log('xmr.monero_wallet_rpc.result', data)

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

interface VerifyPayment {
  url: string;
  tx_hash: string;
  tx_key: string;
}

interface Verify {
  payment_option: any;
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


export async function verifyPayment({payment_option, transaction}: Verify): Promise<boolean> {

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

      const { invoice_uid } = payment_option

      const url = `${config.get('api_base')}/i/${payment_option.invoice_uid}`
    
      log.info('xmr.verifyPayment', {
        invoice_uid, 
        payment_option, 
        tx: transaction.tx,
        tx_key: transaction.tx_key,
        t_hash: transaction.tx_hash,
        url
      })
    
      await verify({
        url,
        tx_hash: String(transaction.tx_hash),
        tx_key: String(transaction.tx_key)
      })
      
    } catch(error) {

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

    log.info('xmr.check_tx_key.result', Object.assign(result, { expected: amount }))

    console.log(`received=${result.received} expected=${amount}`)

    if (amount > result.received) {
      throw new Error(`Invalid XMR Payment received=${result.received} expected=${amount}`)
    }
  }

  return
}
