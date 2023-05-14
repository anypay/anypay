
import { Plugin, BroadcastTxResult, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDT_AVAX extends Plugin {

  chain = 'AVAX'

  currency = 'USDT'

  token = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'

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

