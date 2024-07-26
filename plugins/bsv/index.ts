require('dotenv').config()

import { bsv } from 'scrypt-ts'

import * as taal from './lib/taal'

import * as whatsonchain from './lib/whatsonchain'

import { BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

import oneSuccess from 'promise-one-success'

import { blockchair, config, log } from '../../lib';

import axios from 'axios'

import UTXO_Plugin from '../../lib/plugins/utxo'
import { SetPrice } from '../../lib/prices/price'

const polynym = require('polynym');

export default class BSV extends UTXO_Plugin {

  currency = 'BSV'

  chain = 'BSV'

  decimals = 8

  providerURL = String(config.get('GETBLOCK_BSV_URL'))
  
  get bitcore() {

    return bsv

  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await whatsonchain.getTransactionJSON(txid)

    const height = transaction.blockheight 
    const hash = transaction.blockhash 
    const timestamp = new Date(transaction.blocktime * 1000)
    const depth = transaction.confirmations

    return {
      confirmation_hash: hash,
      confirmation_height: height,
      confirmations: depth,
      confirmation_date: timestamp
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

  async validateAddress(address: string): Promise<boolean> {

    try {

      new bsv.Address(address)

      return true

    } catch(error) {

      log.debug('plugin.bsv.validateAddress.error', error)

      return false

    }

  }

  async transformAddress(alias: string) {

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

  async getPrice(): Promise<SetPrice> {

    const { data } = await axios.get(`https://data.gateapi.io/api2/1/ticker/bsv_usdt`)

    const value = parseFloat(data.last)

    return {
      value,
      base_currency: 'USD',
      currency: this.currency, 
      chain: this.chain, 
      source: 'gate.io'
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
