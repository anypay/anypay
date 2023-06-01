
import * as blockchair from '../../lib/blockchair'

const ltc = require('litecore-lib');

export const currency = 'LTC'

import { BroadcastTx, BroadcastTxResult, Plugin, Confirmation, VerifyPayment, Transaction, Payment } from '../../lib/plugin'

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

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction('LTC', txid)

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

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false //TODO
  }

}

