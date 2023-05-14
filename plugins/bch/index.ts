
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import { Plugin, Transaction, BroadcastTx, Confirmation, BroadcastTxResult, VerifyPayment } from '../../lib/plugin'

import { log } from '../../lib';

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

import { oneSuccess } from 'promise-one-success'

import { getDecodedTransaction } from '../../lib/blockchair'

import * as moment from 'moment'

export default class BCH extends Plugin {

  currency: string = 'BCH'

  chain: string = 'BCH'

  decimals: number = 8;

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction: any = await getDecodedTransaction('BCH', txid)

    console.log('decoded', transaction)

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

      blockchair.publish('bitcoin-cash', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new bch.HDPublicKey(address);

      log.debug('plugins.bch.hdpublickey.valid', address)

      return true;

    } catch(error) {

      log.debug('plugins.bch.hdpublickey.invalid', error)

    }

    try {

      var isCashAddress = bchaddr.isCashAddress

      let valid = isCashAddress(address)

      return valid;

    } catch(error) {

      return false;

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { hex: '' }
  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

}

