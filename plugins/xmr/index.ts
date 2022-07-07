
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { publish } from '../../lib/blockchair'

import { rpc } from './jsonrpc'

import { log } from '../../lib'

export { bitcore }

export async function validateAddress(): Promise<Boolean> {

  return true

}

export async function validateUnsignedTx(): Promise<Boolean> {

  return true

}

export async function broadcastTx(tx_as_hex) {

  let result = await  send_raw_transaction({ tx_as_hex, do_not_relay: false })

  if (result.sanity_check_failed) {
    throw new Error(result.reason)
  }

  if (result.double_spend) {
    throw new Error('double spend')
  }

  if (result.status === 'Failed') {
    throw new Error(result.reason)
  }

}

import axios from 'axios'

import { Client } from 'payment-protocol'

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
    params: {
      tx_as_hex,
      do_not_relay
    }
  }/*, {
    auth: {
      username: process.env.XMR_RPC_USER,
      password: process.env.XMR_RPC_PASSWORD
    }
  }*/)

  let result: SendRawTransactionResult = data

  log.info('plugins.xmr.send_raw_transaction.result', data)

  if (data.status === 'OK') {

  } else {

    const error = new Error(data)

    log.error('plugins.xmr.send_raw_transaction.rejected', error)

    throw error

  }

  return data

}

export async function call(method: string, params: any): Promise<any> {

  let { data } = await axios.post(process.env.XMR_RPC_URL, {
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

  log.info('xmr.rpc.call.result', { method, params, data })

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
  txid: string;
  tx_key: string;
}

export async function verifyPayment({payment_option,tx_hex,tx_key}: any) {

  return true

}

export async function verify({url,txid,tx_key}: VerifyPayment) {

  let client = new Client(url)

  let paymentRequest = await client.paymentRequest({
    chain: 'XMR',
    currency: 'XMR'
  })

  console.log({ paymentRequest })

  let destinations = paymentRequest.instructions[0].outputs

  for (let { address, amount } of destinations) {
   
    console.log({ address, amount })

    let result = await call('check_tx_key', { txid, tx_key, address })

    console.log({
      address,
      expected: amount,
      received: result.received
    })

    if (amount !== result.received) {
      throw new Error('Invalid XMR Payment')
    }
  }
}

