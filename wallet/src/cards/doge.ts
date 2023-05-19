
import { Card, Balance } from '../card'

import * as bitcore from 'bitcore-lib-doge'

import { listUnspent, getBalance } from '../blockchair'

import { BigNumber } from 'bignumber.js'

type PrivateKey = bitcore.HDPrivateKey

export default class DOGE extends Card {

  chain = 'DOGE'

  currency = 'DOGE'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return bitcore.HDPrivateKey.fromSeed(seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

  async getBalance(): Promise<Balance> {

    var { value } = await getBalance(this.chain, this.address)

    this.unspent = await listUnspent(this.chain, this.address)

    if (!value) {

      value = this.unspent.reduce((sum, output) => {

        return sum.plus(output.value)
  
      }, new BigNumber(0)).toNumber()

    }

    return {
      chain: this.chain,
      currency: this.currency,
      decimals: this.decimals,
      value: value,
      address: this.address
    }

  }

}

