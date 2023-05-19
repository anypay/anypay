
import { Card } from '../card'

type PrivateKey = any

export default class ETH extends Card {

  static active = false

  chain = 'ETH'

  currency = 'ETH'

  decimals = 18

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
