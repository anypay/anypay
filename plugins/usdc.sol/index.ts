
import { Payment, Transaction } from '../../lib/plugin'

import SolanaPlugin from '../../lib/plugins/solana'

//TODO: FinishPluginImplementation

export default class USDC_SOL extends SolanaPlugin {

  chain = 'SOL'

  currency = 'USDC'

  token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

  decimals = 6

  async parsePayments(transaction: Transaction): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
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

