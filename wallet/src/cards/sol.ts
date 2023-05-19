
import { Card } from '../card'

import { Keypair } from '@solana/web3.js'

type PrivateKey = Keypair

export default class SOL extends Card {

  static active = false

  chain = 'SOL'

  currency = 'SOL'

  decimals = 9

  privateKeyFromSeed(seed: Buffer): PrivateKey {

    return Keypair.fromSeed(seed.slice(0, 32));

  } 

  get address(): string {

    this.privatekey.publicKey.toString()

  }

}

