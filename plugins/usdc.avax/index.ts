
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, VerifyPayment} from '../../lib/plugin'

const Web3 = require('web3')

//TODO: FinishPluginImplementation

export default class USDC_AVAX extends Plugin {

  chain = 'AVAX'

  currency = 'USDC'

  decimals = 6

  token = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'

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

