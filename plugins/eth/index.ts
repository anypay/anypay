
import { Plugin, BroadcastTxResult, Transaction, Confirmation } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class ETH extends Plugin {

  chain = 'ETH'

  currency = 'ETH'

  decimals = 18

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

  async getConfirmation(txid: string): Promise<Confirmation> {

    //TODO

    return null

  }

}

