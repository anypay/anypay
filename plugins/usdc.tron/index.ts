
import { Plugin, BroadcastTx, BroadcastTxResult, Transaction, Confirmation } from '../../lib/plugin'

import * as trongrid from '../../lib/trongrid'

//const apikey = process.env.trongrid_api_key

//TODO: FinishPluginImplementation

export default class USDC_TRON extends Plugin {

  chain = 'TRON'

  currency = 'USDC'

  token = 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'

  decimals = 6

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

    throw new Error()

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

