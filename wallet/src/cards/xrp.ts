
import { Card } from '../card'

type PrivateKey = any

export default class XMR extends Card {

  static active = false

  chain = 'XMR'

  currency = 'XMR'

  decmials = 0 //TODO

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    throw new Error() // Not implemented

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
