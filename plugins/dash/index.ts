
import { blockchair, blockcypher } from '../../lib'

import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import * as insight from './lib/insight'

import { BroadcastTxResult, VerifyPayment, Transaction, Plugin } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

export default class DASH extends Plugin {

  currency: string = 'DASH'

  chain: string = 'DASH'

  decimals: number = 8;

  async broadcastTx(txhex: string): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('dash', txhex),

      blockcypher.publish('dash', txhex),

      insight.broadcastTx(txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string): Promise<boolean> {

    try {

      new dash.Address(address)

      return true

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error('plugin.dash.getTansaction(txid: string) not implemented')

  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

}

