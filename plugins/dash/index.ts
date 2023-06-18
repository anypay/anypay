

import { blockchair, blockcypher } from '../../lib'

import * as dash from '@dashevo/dashcore-lib';

import * as insight from './lib/insight'

import { BroadcastTx, BroadcastTxResult, Transaction, Plugin, Confirmation, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { getTransaction } from '../../lib/blockcypher'

import * as moment from 'moment'

export default class DASH extends Plugin {

  currency: string = 'DASH'

  chain: string = 'DASH'

  decimals: number = 8;

  get bitcore() {

    return dash

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction('DASH', txid)

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

}

