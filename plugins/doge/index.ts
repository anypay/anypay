
import * as blockchair from '../../lib/blockchair';

const doge = require('bitcore-doge-lib');

export { doge as bitcore }

import { BroadcastTxResult, Plugin, VerifyPayment, Transaction } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

export default class DOGE extends Plugin {

  currency: string = 'DOGE'

  chain: string = 'DOGE'

  decimals: number = 8;

  async broadcastTx(txhex: string): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('dogecoin', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new doge.Address(address);

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

