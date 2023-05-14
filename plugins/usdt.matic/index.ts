
import { Plugin, BroadcastTx, BroadcastTxResult, Transaction, Confirmation } from '../../lib/plugin'

const Web3 = require('web3')

//TODO: FinishPluginImplementation

export default class USDT_MATIC extends Plugin {

  chain = 'MATIC'

  currency = 'USDT'

  token = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'

  decimals = 6

  async getConfirmation(txid: string): Promise<Confirmation> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

    const receipt: any = await web3.eth.getTransactionReceipt(txid)

    if (!receipt) { return }

    const { blockHash: hash, blockNumber: height } = receipt

    if (!hash) { return }

    const block = await web3.eth.getBlock(hash)

    const latestBlock = await web3.eth.getBlock('latest')

    const depth = latestBlock.number - height + 1

    const timestamp = new Date(block.timestamp * 1000)

    return {
      hash,
      height,
      depth,
      timestamp
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

