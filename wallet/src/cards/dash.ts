
import { Card } from '../card'

import * as dash from '@dashevo/dashcore-lib'

type PrivateKey = bitcore.HDPrivateKey

export default class DASH extends Card {

  chain = 'DASH'

  currency = 'DASH'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

}
