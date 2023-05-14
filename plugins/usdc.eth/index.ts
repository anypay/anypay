
import { Plugin, BroadcastTxResult, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_ETH extends Plugin {

  chain = 'ETH'

  currency = 'USDC'

  token = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

  decimals = 6

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

