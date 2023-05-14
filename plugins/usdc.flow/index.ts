
import { Plugin, BroadcastTxResult, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_FLOW extends Plugin {

  chain = 'FLOW'

  currency = 'USDC'

  token = 'A.b19436aae4d94622.FiatToken'

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

