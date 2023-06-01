
const Web3 = require('web3')

import { Transaction, Confirmation, BroadcastTx, BroadcastTxResult, Payment, VerifyPayment, Plugin } from '../../lib/plugin'

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

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(txhex)

    const address = transaction.to.toLowerCase()

    const amount = parseInt(transaction.value.toString())

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

    return new Promise((resolve, reject) => {

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

      web3.eth.sendSignedTransaction(txhex)
      .on('transactionHash', txid => {

        resolve({ txid, txhex, result: txid, success: true })

      })
      .on('receipt', receipt => {

        console.log("web3.ethers.receipt", receipt)

        // TODO: Confirm Transaction

       })
      .on('confirmation', confirmation => console.log("web3.ethers.confirmation", confirmation))

    })

  }

  async validateAddress(address: string): Promise<boolean> {

    return ethers.utils.isAddress(address);

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()

  }

  async verifyPayment({ paymentOption, transaction: {txhex, txid}, protocol }: VerifyPayment) {

    /*

      Determine whether "hex" is a full raw transaction or a txid

      If it is a txid, fetch the transaction details from the blockchain

    */

    const expectedOutput = paymentOption.outputs[0]

    console.log('VERIFY', {txhex,  txid})

    try {

      const transaction = this.decodeTransactionHex({ transactionHex: txhex })

      console.log({transaction})

      const output: any = await this.parsePayments({txhex})

      console.log({output})

      console.log({expectedOutput})

      const correctAddress = output.address.toLowerCase() === expectedOutput.address.toLowerCase()

      console.log({ correctAddress })

      const correctAmount = expectedOutput.amount === parseInt(output.amount)

      console.log({ correctAmount })

      const correctToken = output.symbol.toLowerCase() == this.token.toLowerCase()

      console.log({ correctToken })

      return correctToken && correctAmount && correctAddress

    } catch(error) {

      const [parsed] = await this.parsePayments({ txhex })

      const correctAddress = (parsed.address.toLowerCase() === expectedOutput.address.toLowerCase())

      const correctAmount = (expectedOutput.amount === parsed.amount)

      return correctAmount && correctAddress

    }


  }

  decodeTransactionHex({ transactionHex }: {transactionHex: string}): ethers.Transaction {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(transactionHex)

    return transaction

  }

}

