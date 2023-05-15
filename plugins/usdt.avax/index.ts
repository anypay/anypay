
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, VerifyPayment, Transaction, Payment } from '../../lib/plugin'

const Web3 = require('web3')

import { hexToDec } from 'hex2dec'

import BigNumber from 'bignumber.js'

import { ethers } from 'ethers'

//TODO: FinishPluginImplementation

export default class USDT_AVAX extends Plugin {

  chain = 'AVAX'

  currency = 'USDT'

  token = '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7'

  decimals = 6

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_avalanche_url))

    const result: any = await web3.eth.getTransaction(txid)

    if (result.to.toLowerCase() != this.token) {

      return []

    }

    const input = result.input

    if (
      input.length !== 138 ||
      input.slice(2, 10) !== "a9059cbb"
    ) {
      throw "NO ERC20 TRANSFER";
    }
    const address = `0x${input.slice(34, 74)}`;

    let amount = parseInt(hexToDec(input.slice(74)));

    amount = new BigNumber(amount).times(Math.pow(10, this.decimals * -1)).toNumber()

    return [{
      chain: 'AVAX',
      currency: 'USDT',
      address,
      amount,
      txid 
    }]

  }

  async parsePayments(txhex: string): Promise<Payment[]> {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(txhex)

    if (transaction.to.toLowerCase() != this.token) {

      return []

    }

    const input = transaction.data

    if (
      input.length !== 138 ||
      input.slice(2, 10) !== "a9059cbb"
    ) {
      return []
    }

    const address = `0x${input.slice(34, 74)}`.toLowerCase();

    let amount = parseInt(hexToDec(input.slice(74)));

    amount = new BigNumber(amount).times(Math.pow(10, this.decimals * -1)).toNumber()

    const txid = transaction.hash

    return [{
      chain: 'AVAX',
      currency: 'USDT',
      address,
      amount,
      txid 
    }]

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

