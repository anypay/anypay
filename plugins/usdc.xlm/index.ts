
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_XLM extends Plugin {

  chain = 'XLM'

  currency = 'USDC'

  token = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN'

  decimals = 6

  async parsePayments(transaction: Transaction): Promise<Payment[]> {
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

    throw new Error()

  }

  async validateAddress(address: string) {

    return false

  }

  async verifyPayment(params: { paymentOption: any; transaction: Transaction; protocol?: string }): Promise<boolean> {

    return false

  }

}

