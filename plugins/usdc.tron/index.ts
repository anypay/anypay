
import { Plugin, BroadcastTxResult, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_TRON extends Plugin {

  chain = 'TRON'

  currency = 'USDC'

  token = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'

  async broadcastTx(txhex: string): Promise<BroadcastTxResult> {

    throw new Error()

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()

  }

  async validateAddress(address: string) {

    return false

  }

  async verifyPayment(params) {

    return false

  }

}

