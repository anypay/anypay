
import { Card } from '../card'

type PrivateKey = any

export default class USDC_AVAX extends Card {

  static active = false

  chain = 'AVAX'

  currency = 'USDC'

  decimals = 6

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
