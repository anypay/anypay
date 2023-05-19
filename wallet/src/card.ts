
import { getBitcore } from './bitcore'

import * as blockchair from './blockchair'

import { UTXO } from './utxo'

import { Balance } from './balances'

export { Balance }

import { log } from './log'

import { BigNumber } from 'bignumber.js'

type PrivateKey = any;

import { convertBalance } from './balance'

import { RPC } from './wallet'

import { getRPC } from './rpc'

export abstract class Card {

  static active: boolean = true

  abstract chain: string;

  abstract currency: string;

  seed: Buffer;

  privatekey: PrivateKey;

  address: string;

  active: string;

  unspent: UTXO[];

  constructor(params: {
    seed: Buffer
  }) {
    this.unspent = []
    this.seed = params.seed
    this.privatekey = this.privateKeyFromSeed(params.seed)
  }
  
  abstract privateKeyFromSeed(seed: Buffer): PrivateKey;

  abstract getBalance(): Promise<Balance>;

  async getUnspent() {

    const blockchairUnspent = await blockchair.listUnspent(this.chain, this.address)

    this.unspent = blockchairUnspent
  }

  async listUnspent(): Promise<UTXO[]> {

    let rpc: RPC = getRPC(this.chain)

    if (rpc['listUnspent']) {

      this.unspent = await rpc['listUnspent'](this.address)

    } else {

      try {

        this.unspent = await blockchair.listUnspent(this.chain, this.address)


      } catch(error) {

        error.chain = this.chain
        error.address = this.address

        log.error('blockchair.listUnspent.error', error)

      }
      
    }

    return this.unspent

  }

  //TODO: Refactor balance method into cards plugins
  /*
  async balance(): Promise<Balance> {

    const chain = this.chain

    let rpc = getRPC(this.chain)

    var value;

    const errors = []

    if (rpc['getBalance']) {

      // TODO: Remove Reference to RPC into Plugins
      value = await rpc['getBalance'](this.address)

    } else {

      try {

        // TODO: Remove Reference to Blockchain into Plugins
        value = await blockchair.getBalance(this.chain, this.address)

      } catch(error) {

        errors.push(error)

        error.chain = this.chain
        error.address = this.address

        log.error('blockchair.getBalance.error', error)

      }
      
    }

    // TODO: Remove reference to XMR into plugin(s)
    const { amount: value_usd } = await convertBalance({
      currency: this.currency,
      amount: this.currency === 'XMR' ? value : value / 100000000
    }, 'USD')

    try {

      this.unspent = await this.listUnspent()

      if (!value) {

        value = this.unspent.reduce((sum, output) => {

          return sum.plus(output.value)
    
        }, new BigNumber(0)).toNumber()

      }

      if (errors.length > 0 && !value) {

        value = false
      }

      return {
        chain: this.chain,
        currency: this.currency,
        value: value,
        value_usd,
        address: this.address,
        errors
      }

    } catch(error) {

      return {
        chain: this.chain,
        currency: this.currency,
        value: value,
        value_usd,
        address: this.address,
        errors
      }

    }


  }
  */
}

