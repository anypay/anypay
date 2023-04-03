
import { polygon } from 'usdc'

import { Transaction } from 'ethers'

const Web3 = require('web3')

export async function validateAddress(address: string): Promise<boolean> {

  return polygon.isAddress({ address })

}

class BitcoreTransaction {
  hex: string;
  transaction: Transaction;
  constructor(hex) {
      this.hex = hex
      this.transaction = polygon.decodeTransactionHex({ transactionHex: hex })

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

  const output: any = polygon.parseUSDCOutput({ transactionHex: hex })

  const expectedOutput = payment_option.outputs[0]

  const correctAddress = output.address.toLowerCase() === expectedOutput.address.toLowerCase()

  const correctAmount = expectedOutput.amount === parseInt(output.amount)

  return correctAmount && correctAddress

}

export async function broadcastTx(txhex: string) {

  console.log("broadcastSignedTransaction", txhex)

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

  const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

  console.log('polygon.provider.sendTransaction.result', transmitResult)

  return transmitResult

}

class Bitcore {

  get Transaction() {
      return BitcoreTransaction
  }

}

const bitcore = new Bitcore()

export { bitcore }