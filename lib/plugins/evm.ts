
const Web3 = require('web3')

import { Transaction, Confirmation, BroadcastTx, BroadcastTxResult, Payment, VerifyPayment, Plugin } from '../../lib/plugin'

import { ethers } from 'ethers'

import { confirmPaymentByTxid, revertPayment } from '../confirmations'
import prisma from '../prisma';

export abstract class EVM extends Plugin {

  providerURL: string | undefined;

  chainID: number | undefined;

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

    const address = String(transaction.to?.toLowerCase())

    const amount = parseInt(transaction.value.toString())

    const txid = String(transaction.hash)

    return [{ address, amount, txid, chain: this.chain, currency: this.currency }]

  }

  async getConfirmation(txid: string): Promise<Confirmation | null> {

    const record = await prisma.evmTransactionReceipts.findFirst({
      where: {
        txid
      }
    })

    if (record) {

    }

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

    let receipt: any = await web3.eth.getTransactionReceipt(txid)

    if (!receipt) { return null } 

    //TODO: Handle Unfortunate Cirmcumstance When EVM Reverts the Transaction

    const { blockHash: confirmation_hash, blockNumber: confirmation_height } = receipt

    if (!confirmation_hash) { return null }

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

      receiptListener.once('transactionHash', (txid: string) => {

        resolve({ txid, txhex, result: txid, success: true })

      })
      .once('receipt', (receipt: TransactionReceipt) => {

        console.log("web3.ethers.receipt", receipt)

        if (receipt.status) {

          console.log("web3.ethers.confirmation", {receipt})

          handleTransactionReceipt(web3, receipt)

        } else {

          revertPayment({ txid: receipt.transactionHash })

        }

        receiptListener.removeAllListeners('transactionHash')

        receiptListener.removeAllListeners('receipt')

        //receiptListener.removeAllListeners('confirmation')

       })
      /*.once('confirmation', async (confirmation, receipt: TransactionReceipt) => {

        try {

          console.log("web3.ethers.confirmation", {confirmation, receipt})

          handleTransactionReceipt(web3, receipt)

          receiptListener.removeAllListeners('transactionHash')

          receiptListener.removeAllListeners('receipt')

          receiptListener.removeAllListeners('confirmation')

        } catch(error) {

          console.error('EVM Confirmation Error', error)

        }

      })
      */
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

    const expectedOutput = (paymentOption.outputs as any[])[0]

    const [output]: any = await this.parsePayments({txhex})

    const correctAddress = String(output.address).toLowerCase() === expectedOutput.address.toLowerCase()

    const correctAmount = expectedOutput.amount === parseInt(output.amount)

    if (output.symbol) {

      const correctToken = output.symbol.toLowerCase() == this.token?.toLowerCase()

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

async function handleTransactionReceipt(web3: { eth: { getBlock: (arg0: string | undefined) => any } }, receipt: TransactionReceipt): Promise<void> {

  if (!receipt.status) {
    revertPayment({ txid: receipt.transactionHash })
    return
  }

  const block = await web3.eth.getBlock(receipt.blockHash)

  const confirmResult = await confirmPaymentByTxid({
    txid: receipt.transactionHash,
    confirmation: {
      confirmation_height: Number(receipt.blockNumber),
      confirmation_hash: String(receipt.blockHash),
      confirmation_date: new Date(block.timestamp * 1000)
    }
  })

  console.log({ confirmResult })

  var isNew = false;

  let record = await prisma.evmTransactionReceipts.findFirst({
    where: {
      txid: receipt.transactionHash
    }
  })

  if (!record) {

    isNew = true
    record = await prisma.evmTransactionReceipts.create({
      data: {
        txid: receipt.transactionHash,
        receipt: String(receipt),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    
    })
  }

  if (isNew) {

    console.log('evm.transactionReceipt.saved', record)

  }

}
