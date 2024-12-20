
import {  Transaction, Payment } from '@/lib/plugin'

import SolanaPlugin from '@/lib/plugins/solana'

//TODO: FinishPluginImplementation

export default class USDT_SOL extends SolanaPlugin {

  chain = 'SOL'

  currency = 'USDT'

  token = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

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

  async verifyPayment(params: { paymentOption: any; transaction: Transaction; protocol?: string }): Promise<boolean> {

    throw new Error()//TODO

  }

}

