
import { Card } from '../card'

import * as bitcore from 'bitcore-lib-cash'

type PrivateKey = bitcore.HDPrivateKey

export default class BCH extends Card {

  chain = 'BCH'

  currency = 'BCH'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

}
