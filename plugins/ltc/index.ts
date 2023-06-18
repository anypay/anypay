
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export const currency = 'LTC'

import { BroadcastTx, BroadcastTxResult, Plugin, Confirmation,  Transaction, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { getTransaction } from '../../lib/blockcypher'

import * as moment from 'moment'

export default class LTC extends Plugin {

  currency: string = 'LTC'

  chain: string = 'LTC'

  decimals: number = 8;

  get bitcore() {

    return ltc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction('LTC', txid)

    if (!transaction) { return }

    if (!transaction.block_hash) { return }

    return {
      confirmation_height: transaction.block_height,
      confirmation_hash: transaction.block_hash, 
      confirmation_date: moment(transaction.confirmed).toDate(),
      confirmations: transaction.confirmations
    }

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

