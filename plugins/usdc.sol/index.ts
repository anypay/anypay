
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_SOL extends Plugin {

  chain = 'SOL'

  currency = 'USDC'

  token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

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

