
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class HBAR extends Plugin {

  chain = 'HBAR'

  currency = 'HBAR'

  decimals = 0 //TODO

  async parsePayments(txhex: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    throw new Error() //TODO

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    throw new Error() //TODO

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

