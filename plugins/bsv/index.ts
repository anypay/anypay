require('dotenv').config()

import * as bsv from 'bsv';

import * as taal from './lib/taal'

import * as whatsonchain from './lib/whatsonchain'

import { BroadcastTx, BroadcastTxResult, Confirmation, VerifyPayment, Transaction, Plugin, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { blockchair, log } from '../../lib';

const polynym = require('polynym');

export default class BSV extends Plugin {

  currency: string = 'BSV'

  chain: string = 'BSV'

  decimals: number = 8

  get bitcore() {

    return bsv

  }

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await whatsonchain.getTransactionJSON(txid)

    const height = transaction.blockheight 
    const hash = transaction.blockhash 
    const timestamp = new Date(transaction.blocktime * 1000)
    const depth = transaction.confirmations

    return {
      hash,
      height,
      depth,
      timestamp
    }

  }

  async broadcastTx({txhex}: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      taal.broadcastTransaction(txhex),

      blockchair.publish('bitcoin-sv', txhex),

      whatsonchain.broadcastTx(txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async getTransaction(txid: string): Promise<Transaction> {

    let txhex = await whatsonchain.getTransaction(txid)

    return { txhex }

  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

  async validateAddress(address: string): Promise<boolean> {

    try {

      new bsv.Address(address)

      return true

    } catch(error) {

      log.debug('plugin.bsv.validateAddress.error', error)

      return false

    }

  }

  async transformAddress(alias: string){

    try {

      if (alias.match(':')) {

        alias = alias.split(':')[1];

      }

      alias = alias.split('?')[0];

      return (await polynym.resolveAddress(alias)).address;

    } catch(error) {

      throw new Error('invalid BSV address');

    }

  }

}

export async function transformAddress(alias: string){

  try {

    if (alias.match(':')) {

      alias = alias.split(':')[1];

    }

    alias = alias.split('?')[0];

    return (await polynym.resolveAddress(alias)).address;

  } catch(error) {
    throw new Error('invalid BSV address');
  }

}


