
//import { log } from '../../lib/log'

import { ethereum } from 'usdc'

import { Transaction } from 'ethers'

const Web3 = require('web3')

import * as ethers from 'ethers'

export async function validateAddress(address: string): Promise<boolean> {

  return ethereum.isAddress({ address })

}

class BitcoreTransaction {
  hex: string;
  transaction: Transaction | { hash: string };
  constructor(hex) {

      this.hex = hex

      if (hex.length === 66) {

        this.transaction = { hash: hex }

      } else {

        //this.transaction = ethereum.decodeTransactionHex({ transactionHex: hex })

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
interface VerifyPayment {
  payment_option: any;
  transaction: {
      tx: string;
  };
  protocol: string;
}

export async function verifyPayment({ payment_option, transaction: {tx: hex}, protocol }: VerifyPayment) {

  /*

    Determine whether "hex" is a full raw transaction or a txid

    If it is a txid, fetch the transaction details from the blockchain

  */

  const expectedOutput = payment_option.outputs[0]


  try {

    const transaction: ethers.Transaction = ethers.utils.parseTransaction(hex)

    console.log('eth.transaction.parsed', transaction)

  } catch(error) {


  }

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_ethereum_url))

  const result: any = await web3.eth.getTransaction(hex)

  console.log('web3.eth.getTransaction.result', {hex, result})

  const correctAddress = expectedOutput.address == result.to

  if (!correctAddress) { console.log('incorrect address', { expected: expectedOutput.address, actual: result.to }) }

  const correctAmount = expectedOutput.amount == parseInt(result.value)

  if (!correctAmount) { console.log('incorrect amount', { expected: expectedOutput.amount, actual: result.value }) }

  return correctAddress && correctAmount

}

export async function broadcastTx(txhex: string) {

  if (txhex.length === 66) {

    console.log('skip ethereum broadcast of txid', { txid: txhex })

    return txhex

  }

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_ethereum_url))

  const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

  console.log('ethereum.provider.sendTransaction.result', transmitResult)

  return transmitResult

}

class Bitcore {

  get Transaction() {
      return BitcoreTransaction
  }

}

const bitcore = new Bitcore()

export { bitcore }
