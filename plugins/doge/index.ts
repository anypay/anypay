
import * as blockchair from '../../lib/blockchair';

var WAValidator = require('anypay-wallet-address-validator');

const doge = require('bitcore-doge-lib');


export { doge as bitcore }

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DOGE')

  return valid;

}

import { BroadcastTxResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    blockchair.publish('dogecoin', rawTx)

  ]

  return oneSuccess<BroadcastTxResult>(broadcastProviders)

}

const currency = 'DOGE';

export {

  currency

}

