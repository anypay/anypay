
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

import * as trongrid from '../../lib/trongrid'

//TODO: FinishPluginImplementation

export default class TRON extends Plugin {

  chain = 'TRON'

  currency = 'TRON'

  decimals = 0 //TODO

  async parsePayments(txhex: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await trongrid.getTransaction(txid)

    const height = transaction.blockNumber

    const timestamp = new Date(transaction.blockTimestamp)

    const block = await trongrid.getBlock(height)

    const hash = block.blockID

    const nowBlock = await trongrid.getLatestBlock()

    const currentHeight = nowBlock.block_header.raw_data.number

    return {
      hash,
      height,
      timestamp,
      depth: currentHeight - height + 1
    }
  
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

  async verifyPayment(params) {

    return false

  }

}

