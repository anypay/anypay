
import { Card } from '../card'

import * as bitcore from 'litecore-lib'

type PrivateKey = bitcore.HDPrivateKey

export default class LTC extends Card {

  chain = 'LTC'

  currency = 'LTC'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

}
