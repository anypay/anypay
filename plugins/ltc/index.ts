
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export { ltc as bitcore }

export const currency = 'LTC'

export async function getNewAddress(record) {
  return record.value;
}

import { BroadcastTxResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    blockchair.publish('litecoin', rawTx)

  ]

  return oneSuccess<BroadcastTxResult>(broadcastProviders)

}