
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import { Plugin, Transaction, BroadcastTxResult, VerifyPayment } from '../../lib/plugins'

import {log} from '../../lib';

import { Account } from '../../lib/account'

import { Address } from '../../lib/addresses'

import { findOne } from '../../lib/orm'

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

import { oneSuccess } from 'promise-one-success'

export default class BCH extends Plugin {

  currency: string = 'BCH'

  chain: string = 'BCH'

  decimals: number = 8;

  async broadcastTx(txhex: string): Promise<BroadcastTxResult> {

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

  async getNewAddress(account: Account): Promise<Address> {

    let address = await findOne<Address>(Address, {
      where: {
        account_id: account.get('id'),
        currency: 'BCH',
        chain: 'BCH'
      }
    })

    return address

  }

}

