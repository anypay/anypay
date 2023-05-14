
import { Plugin, BroadcastTxResult, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class XLM extends Plugin {

  chain = 'XLM'

  currency = 'XLM'

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

