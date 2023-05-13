
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export { ltc as bitcore }

export const currency = 'LTC'

import { BroadcastTxResult, Plugin, VerifyPayment, Transaction } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

export default class LTC extends Plugin {

  currency: string = 'LTC'

  chain: string = 'LTC'

  decimals: number = 8;

  async broadcastTx(txhex: string): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('litecoin', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new ltc.Address(address);

      return true;

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { hex: '' }
  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

}

