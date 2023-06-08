
import * as blockchair from '../../lib/blockchair';

const doge = require('bitcore-doge-lib');

import { BroadcastTxResult, BroadcastTx, Transaction, Plugin, Confirmation } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { getTransaction } from '../../lib/blockcypher'

import * as moment from 'moment'

export default class DOGE extends Plugin {

  currency: string = 'DOGE'

  chain: string = 'DOGE'

  decimals: number = 8;

  get bitcore() {
    return doge
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction('DOGE', txid)

    if (!transaction) { return }

    if (!transaction.block_hash) { return }

    return {
      height: transaction.block_height,
      hash: transaction.block_hash, 
      timestamp: moment(transaction.confirmed).toDate(),
      depth: transaction.confirmations
    }

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

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

    return { txhex: '' } //TODO
  }

}

