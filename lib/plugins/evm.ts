
const Web3 = require('web3')

import { Transaction, Confirmation, BroadcastTx, BroadcastTxResult, Payment, VerifyPayment, Plugin } from '../../lib/plugin'

import { ethers } from 'ethers'

import { models } from '../models'

import { confirmPaymentByTxid, revertPayment } from '../confirmations'

export abstract class EVM extends Plugin {

  providerURL: string;

  chainID: number;

  web3: typeof Web3;

  constructor() {
    super()
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)
  }

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

    const transaction: any= await web3.eth.getTransaction(txid)

    const address = transaction.to.toLowerCase()

    const amount = parseInt(transaction.value)

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

    let record = await models.EvmTransactionReceipt.findOne({
      where: { txid }
    })

    if (record) {

    }

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

    let receipt: any = await web3.eth.getTransactionReceipt(txid)

    if (!receipt) { return } 

    //TODO: Handle Unfortunate Cirmcumstance When EVM Reverts the Transaction

    const { blockHash: confirmation_hash, blockNumber: confirmation_height } = receipt

    if (!confirmation_hash) { return }

    const block = await web3.eth.getBlock(confirmation_hash)

    const latestBlock = await web3.eth.getBlock('latest')

    const confirmations = latestBlock.number - confirmation_height + 1

    const confirmation_date = new Date(block.timestamp * 1000)

    return {
      confirmation_hash,
      confirmation_height,
      confirmation_date,
      confirmations
    }

  }

  async broadcastTx({txhex}: BroadcastTx): Promise<BroadcastTxResult> {

    return new Promise(async (resolve, reject) => {


      const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

      if (txhex.length === 66) {

        const txid = txhex

        // SKIP BROADCAST
        resolve({
          txhex, //TODO
          txid,
          result: txhex,
          success: true 
        })

        const receipt = await web3.eth.getTransactionReceipt(txid)

        if (receipt) {

          handleTransactionReceipt(web3, receipt)

        }

        return

      }

      const receiptListener = web3.eth.sendSignedTransaction(txhex)

      receiptListener.on('transactionHash', txid => {

        resolve({ txid, txhex, result: txid, success: true })

      })
      .on('receipt', (receipt: TransactionReceipt) => {

        console.log("web3.ethers.receipt", receipt)

        if (!receipt.status) {
          return revertPayment({ txid: receipt.transactionHash })
        }

       })
      .on('confirmation', async (confirmation, receipt: TransactionReceipt) => {

        try {

          console.log("web3.ethers.confirmation", {confirmation, receipt})

          handleTransactionReceipt(web3, receipt)

          receiptListener.off('confirmation')
          receiptListener.off('receipt')

        } catch(error) {

          console.error('EVM Confirmation Error', error)

        }

      })

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

    const [output]: any = await this.parsePayments({txhex})

    const correctAddress = String(output.address).toLowerCase() === expectedOutput.address.toLowerCase()

    const correctAmount = expectedOutput.amount === parseInt(output.amount)

    if (output.symbol) {

      const correctToken = output.symbol.toLowerCase() == this.token.toLowerCase()

      return correctToken && correctAmount && correctAddress

    } else {

      return correctAmount && correctAddress

    }

  }

  decodeTransactionHex({ transactionHex }: {transactionHex: string}): ethers.Transaction {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(transactionHex)

    return transaction

  }

}

interface TransactionReceipt {
  status: boolean;
  transactionHash: string;
  transactionIndex: number;
  blockHash?: string;
  blockNumber?: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  gasUsed: number;
  logs: any[];
}

async function handleTransactionReceipt(web3, receipt: TransactionReceipt): Promise<void> {

  if (!receipt.status) {
    revertPayment({ txid: receipt.transactionHash })
    return
  }

  const block = await web3.eth.getBlock(receipt.blockHash)

  const confirmResult = await confirmPaymentByTxid({
    txid: receipt.transactionHash,
    confirmation: {
      confirmation_height: receipt.blockNumber,
      confirmation_hash: receipt.blockHash,
      confirmation_date: new Date(block.timestamp * 1000)
    }
  })

  console.log({ confirmResult })

  const [record, isNew] = await models.EvmTransactionReceipt.findOrCreate({
    where: {
      txid: receipt.transactionHash
    },
    defaults: {
      txid: receipt.transactionHash,
      receipt
    }
  })

  if (isNew) {

    console.log('evm.transactionReceipt.saved', record.toJSON())

  }

}
