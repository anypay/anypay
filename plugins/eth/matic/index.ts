
import { log } from '../../lib/log'

import { polygon } from 'usdc'

import { Transaction } from 'ethers'

const Web3 = require('web3')

export async function validateAddress(address: string): Promise<boolean> {

  return polygon.isAddress({ address })

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

export async function broadcastTx(txhex: string) {

  if (txhex.length === 66) {

    console.log('skip USDC polygon broadcast of txid', { txid: txhex })

    return txhex

  }

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
