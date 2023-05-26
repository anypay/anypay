
import Card from './_base'

import { ethers } from 'ethers'

interface EvmCardParams {
  phrase: string;
}

export default abstract class EVM_Card extends Card {

  constructor(params?: EvmCardParams) {

    super()

    if (params.phrase) {

      this.phrase = params.phrase

    }

  }

  get provider() {

    return process.env.APP_ENV === 'browser' ? 
      new ethers.BrowserProvider(window.ethereum, this.chainID) :
      new ethers.JsonRpcProvider(this.providerURL, this.chainID)

  }

  async getAddress(): Promise<string> {

    const signer = await this.provider.getSigner()

    return signer.address
  }

  getPrivateKey(): ethers.HDNodeWallet {

    const wallet = ethers.Wallet.fromPhrase(this.phrase)

    wallet.connect(this.provider)

    return wallet

  }

}


