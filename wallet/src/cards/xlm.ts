
import { Card } from '../card'

import * as bitcore from 'bitcore-lib'

type PrivateKey = bitcore.HDPrivateKey

export default class BTC extends Card {

  chain = 'BTC'

  currency = 'BTC'

  decimals = 0 //TODO

  constructor({ seed }: { seed: Buffer }) {

    this.seed = seed

    super({
      chain: string,
      currency: string,
      privatekey?: string,
    })

  }

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

  get privatekey(): string {

    return bitcore.privateKey.toWIF()
  }

  static fromSeed({ seed }: { seed: Buffer }): Card {


  }

}
