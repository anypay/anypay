
import { log } from '../../lib/log'

import { polygon } from 'usdc'

import { Transaction } from 'ethers'

const Web3 = require('web3')

import { VerifyPayment, Plugin, Transaction as AnypayTransaction, Confirmation, BroadcastTx, BroadcastTxResult, Payment } from '../../lib/plugin'

import { hexToDec } from 'hex2dec'

import BigNumber from 'bignumber.js'

import { ethers } from 'ethers'


export default class USDC_MATIC extends Plugin {

  currency = 'USDC'

  chain = 'MATIC'

  token = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

  decimals = 6

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

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
      chain: 'MATIC',
      currency: 'USDC',
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
      chain: 'MATIC',
      currency: 'USDC',
      address,
      amount,
      txid 
    }]

  }

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

  async validateAddress(address: string): Promise<boolean> {

    return polygon.isAddress({ address })

  }

  async getTransaction(txid: string): Promise<AnypayTransaction> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

    const result: any = await web3.eth.getTransaction(txid)

    log.debug('plugin.usdc.matic.getTransaction', result)

    throw new Error('plugin.usdc.matic.getTransaction() not implemented')

  }

  async broadcastTx({txhex}: BroadcastTx): Promise<BroadcastTxResult> {

    if (txhex.length === 66) {

      console.log('skip USDC polygon broadcast of txid', { txid: txhex })

      return {
        txhex,
        txid: '', //TODO
        result: txhex,
        success: true 
      }

    }

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

    const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

    console.log('polygon.provider.sendTransaction.result', transmitResult)

    return transmitResult

  }

  async verifyPayment({ payment_option, transaction: {tx: hex}, protocol }: VerifyPayment) {

    /*

      Determine whether "hex" is a full raw transaction or a txid

      If it is a txid, fetch the transaction details from the blockchain

    */

    const expectedOutput = payment_option.outputs[0]

    try {

      const output: any = polygon.parseUSDCOutput({ transactionHex: hex })

      const correctAddress = output.address.toLowerCase() === expectedOutput.address.toLowerCase()

      const correctAmount = expectedOutput.amount === parseInt(output.amount)

      return correctAmount && correctAddress

    } catch(error) {

      const { parsed, full } = await polygon.fetchERC20Transfer({ txid: hex })

      log.info('usdc.polygon.fetchERC20Transfer.result', { parsed, full })

      if (parsed.token !== '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') {

        console.log('Not USDC Transfer')

        throw new Error('Not USDC Transfer')

      }

      const correctAddress = parsed.address.toLowerCase() === expectedOutput.address.toLowerCase()

      const correctAmount = expectedOutput.amount === parsed.amount

      return correctAmount && correctAddress

    }

  }

}

class BitcoreTransaction {
  hex: string;
  transaction: Transaction | { hash: string };
  constructor(hex) {

      this.hex = hex

      if (hex.length === 66) {

        this.transaction = { hash: hex }

      } else {

        this.transaction = polygon.decodeTransactionHex({ transactionHex: hex })

      }

  }

  get hash() {
      return this.transaction.hash
  }
  toJSON() {
      return {
          hash: this.hash,
          hex: this.hex
      }
  }
}

class Bitcore {

  get Transaction() {
      return BitcoreTransaction
  }

}

const bitcore = new Bitcore()

export { bitcore }
