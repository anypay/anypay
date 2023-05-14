
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class XRP extends Plugin {

  chain = 'XRP'

  currency = 'XRP'

  decimals = 0 //TODO

  async getConfirmation(txid: string): Promise<Confirmation> {

    throw new Error() // TODO

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    throw new Error()//TODO

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

