
import { Card } from '../card'

import * as bitcore from 'bsv'

type PrivateKey = bitcore.HDPrivateKey

export default class BSV extends Card {

  chain = 'BSV'

  currency = 'BSV'

  decimals = 8

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return btc.HDPrivateKey['fromSeed'](seed)

  } 

  get address(): string {

    return bitcore.privateKey.toAddress().toString()

  }

}
