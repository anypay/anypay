
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export const currency = 'LTC'

import { BroadcastTx, BroadcastTxResult,  Transaction, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import UTXO_Plugin from '../../lib/plugins/utxo'

export default class LTC extends UTXO_Plugin {

  currency = 'LTC'

  chain = 'LTC'

  decimals = 8

  providerURL = process.env.getblock_ltc_url

  get bitcore() {

    return ltc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

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

    return { txhex: '' } //TODO
  }

}


