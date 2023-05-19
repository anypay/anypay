
import { Card } from '../card'

type PrivateKey = any

export default class AVAX extends Card {

  static active = false

  chain = 'AVAX'

  currency = 'AVAX'

  decimals = 18

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
