
import { Card } from '../card'

type PrivateKey = any

export default class USDT_ETH extends Card {

  static active = false

  chain = 'ETH'

  currency = 'USDT'

  decimals = 6

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
