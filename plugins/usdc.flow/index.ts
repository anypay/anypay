
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_FLOW extends Plugin {

  chain = 'FLOW'

  currency = 'USDC'

  token = 'A.b19436aae4d94622.FiatToken'

  decimals = 6

  async parsePayments(txhex: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }



  async getConfirmation(txid: string): Promise<Confirmation> {

    throw new Error() // TODO

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    throw new Error()//TODO

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()//TODO

  }

  async validateAddress(address: string): Promise<boolean> {

    throw new Error()//TODO

  }

  async verifyPayment(params): Promise<boolean> {

    throw new Error()//TODO

  }

}

