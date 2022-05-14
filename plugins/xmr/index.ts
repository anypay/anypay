
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { publish } from '../../lib/blockchair'

import { rpc } from './jsonrpc'

export { bitcore }

export async function validateAddress(): Promise<Boolean> {

  return true

}

export async function validateUnsignedTx(): Promise<Boolean> {

  return true

}

export async function verifyPayment(params: any): Promise<Boolean> {

  return  true

}

interface MoneroSumbmitResponse {

}

export async function submitSignedPayment(rawTx: string): Promise<MoneroSumbmitResponse> {

  return broadcastTx(rawTx)

}

export async function broadcastTx(rawTx) {

  let response = await rpc.call('submit_transfer', {
    "tx_data_hex": rawTx
  })

  if (response.error) {

    throw new Error(response.error.message)
  }

  console.log('RPC_RESPONSE', response)

  return response

  /* TODO: Actually Broadcast Transaction */

  //await publish('monero', rawTx)

  return {}
}

