
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction } from '../../lib/plugin'

//TODO: FinishPluginImplementation

export default class USDC_HBAR extends Plugin {

  chain = 'HBAR'

  currency = 'USDC'

  token = '0.0.456858'

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

