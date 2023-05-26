
import Card from './_base'

import { ethers } from 'ethers'

export default abstract class EVM_Card extends Card {

  constructor() {

    super()

    if (!this.provider) {

      this.provider = process.env.APP_ENV === 'browser' ? 
          new ethers.BrowserProvider(window.ethereum, this.chainID) :
          new ethers.JsonRpcProvider(this.providerURL, this.chainID)
    }

  }

  async getAddress(): Promise<string> {

    const signers = await this.provider.getSigners()

    return signers[0].address
  }

  getPrivateKey(): ethers.HDNodeWallet {

    const wallet = ethers.Wallet.fromPhrase(this.mnemonic)

    wallet.connect(this.provider)

    return wallet

  }

}


