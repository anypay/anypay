
const Web3 = require('web3')

import { Transaction, Confirmation, BroadcastTx, BroadcastTxResult, Payment, Plugin } from '../../lib/plugin'

import BigNumber from 'bignumber.js'

import { ethers } from 'ethers'

//TODO: FinishPluginImplementation

export abstract class EVM extends Plugin {

  providerURL: string;

  chainID: number;

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

    const transaction: any= await web3.eth.getTransaction(txid)

    const address = transaction.to.toLowerCase()

    const amount = new BigNumber(parseInt(transaction.value)).times(Math.pow(10, this.decimals * -1)).toNumber()

    return [{ address, amount, txid, chain: this.chain, currency: this.currency }]

  }

  async parsePayments(txhex: string): Promise<Payment[]> {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(txhex)

    const address = transaction.to.toLowerCase()

    const amount = parseFloat(ethers.utils.formatEther(transaction.value))

    const txid = transaction.hash

    return [{ address, amount, txid, chain: this.chain, currency: this.currency }]

  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

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

  async broadcastTx({txhex}: BroadcastTx): Promise<BroadcastTxResult> {

    if (txhex.length === 66) {

      console.log('skip broadcast of txid', { txid: txhex })

      return {
        txhex,
        txid: '', //TODO
        result: txhex,
        success: true 
      }

    }

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

    const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

    return transmitResult

  }

  async validateAddress(address: string): Promise<boolean> {

    return ethers.utils.isAddress(address);

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()

  }

  async verifyPayment(params) {

    return false

  }

  decodeTransactionHex({ transactionHex }: {transactionHex: string}): ethers.Transaction {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(transactionHex)

    return transaction

  }

}

