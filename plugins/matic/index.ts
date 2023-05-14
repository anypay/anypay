
import { Plugin, BroadcastTxResult, Transaction, Confirmation } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class MATIC extends Plugin {

  chain = 'MATIC'

  currency = 'MATIC'

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

