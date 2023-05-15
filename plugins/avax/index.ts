
import { Plugin, VerifyPayment, BroadcastTx, BroadcastTxResult, Transaction, Confirmation, Payment } from '../../lib/plugin'

import BigNumber from 'bignumber.js'

const Web3 = require('web3')

import { ethers } from 'ethers'

//TODO: FinishPluginImplementation

export default class AVAX extends Plugin {

  chain = 'AVAX'

  currency = 'AVAX'

  decimals = 18

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_avalanche_url))

    const result: any = await web3.eth.getTransaction(txid)

    const address = result.to.toLowerCase()

    const amount = new BigNumber(parseInt(result.value)).times(Math.pow(10, this.decimals * -1)).toNumber()

    return [{ address, amount, txid, chain: 'AVAX', currency: 'AVAX' }]

  }

  async parsePayments(txhex: string): Promise<Payment[]> {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(txhex)

    const address = transaction.to.toLowerCase()

    const amount = parseFloat(ethers.utils.formatEther(transaction.value))

    const txid = transaction.hash

    return [{ address, amount, txid, chain: 'AVAX', currency: 'AVAX' }]

  }

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

