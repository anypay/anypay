
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, VerifyPayment, Transaction } from '../../lib/plugin'

const Web3 = require('web3')

//TODO: FinishPluginImplementation

export default class USDT_AVAX extends Plugin {

  chain = 'AVAX'

  currency = 'USDT'

  token = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'

  decimals = 6

  async getConfirmation(txid: string): Promise<Confirmation> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_avalanche_url))

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

    throw new Error() //TODO

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error() //TODO

  }

  async validateAddress(address: string): Promise<boolean> {

    throw new Error() //TODO

  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    throw new Error() //TODO

  }



}

