
export const currency = 'XMR'

import * as bitcore from './bitcore'

import { publish } from '../../lib/blockchair'

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

  /* TODO: Actually Broadcast Transaction */

  await publish('monero', rawTx)

  return {}
}

