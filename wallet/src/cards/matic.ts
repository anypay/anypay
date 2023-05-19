
import { Card } from '../card'

import { Wallet } from 'ethers'

type PrivateKey = Wallet

export default class MATIC extends Card {

  static active = false

  chain = 'MATIC'

  currency = 'MATIC'

  decimals = 18

  privateKeyFromSeed(mnemonic: Buffer): PrivateKey {

    return Wallet.fromMnemonic(mnemonic)

  } 

  get address(): string {

    throw new Error() // Not implemented

  }

}
