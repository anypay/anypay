
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDT_SOL extends Plugin {

  chain = 'SOL'

  currency = 'USDT'

  token = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

  decimals = 6

  async getConfirmation(txid: string): Promise<Confirmation> {

    throw new Error()//TODO

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

