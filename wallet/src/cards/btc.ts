
import { Card } from '../card'

import * as bitcore from 'bitcore-lib'

type PrivateKey = bitcore.HDPrivateKey

export default class BTC extends Card {

  chain = 'BTC'

  currency = 'BTC'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

}
