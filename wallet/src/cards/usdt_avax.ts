
import { Card } from '../card'

type PrivateKey = any

export default class USDT_AVAX extends Card {

  static active = false

  chain = 'AVAX'

  currency = 'USDT'

  decimals = 6

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
