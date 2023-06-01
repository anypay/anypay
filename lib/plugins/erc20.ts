
import { EVM } from './evm'

import { log } from '../../lib/log'

import { Transaction, Payment, VerifyPayment } from '../../lib/plugin'

import { BigNumber } from 'bignumber.js'

const Web3 = require('web3')

import { hexToDec } from 'hex2dec'

import { ethers } from 'ethers'

import ERC20_ABI from '../erc20_abi';

//TODO: FinishPluginImplementation

export class ERC20 extends EVM {

  chain = ''

  currency = ''

  decimals = 0

  async buildSignedPayment({ paymentOption, mnemonic }): Promise<Transaction> {

    const address = paymentOption.outputs[0].address

    const amount = paymentOption.outputs[0].amount

    return this.buildERC20Transfer({
      providerURL: this.providerURL,
      token: this.token,
      address,
      amount,
      mnemonic
    })

  }

  async getPayments(txid: string): Promise<Payment[]> {

    const web3 = new Web3(new Web3.providers.HttpProvider(this.providerURL), this.chainID)

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
      chain: this.chain,
      currency: this.currency,
      address,
      amount,
      txid 
    }]

  }

  async parsePayments({txhex}: Transaction): Promise<Payment[]> {

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
      chain: this.chain,
      currency: this.currency,
      address,
      amount,
      txid 
    }]

  }

  async verifyPayment({ paymentOption, transaction: {txhex, txid}, protocol }: VerifyPayment) {

    /*

      Determine whether "hex" is a full raw transaction or a txid

      If it is a txid, fetch the transaction details from the blockchain

    */

    const expectedOutput = paymentOption.outputs[0]

    try {

      const transaction = this.decodeTransactionHex({ transactionHex: txhex })

      const output: any = this.parseERC20Transfer(transaction)

      const correctAddress = output.address.toLowerCase() === expectedOutput.address.toLowerCase()

      const correctAmount = expectedOutput.amount === parseInt(output.amount)

      const correctToken = output.symbol.toLowerCase() == this.token.toLowerCase()

      return correctToken && correctAmount && correctAddress

    } catch(error) {

      const { parsed, full } = await this.fetchERC20Transfer({ txid })

      log.info('fetchERC20Transfer.result', { parsed, full })

      if (parsed.token !== this.token) {

        console.log(`Not $(this.token}  Transfer`)

        throw new Error(`Not ${this.token} Transfer`)

      }

      const correctAddress = (parsed.address.toLowerCase() === expectedOutput.address.toLowerCase())

      const correctAmount = (expectedOutput.amount === parsed.amount)

      return correctAmount && correctAddress

    }

  }

  async fetchERC20Transfer({ txid }: { txid: string }): Promise<{
    parsed: {
      address: string,
      amount: number,
      token: string
    },
    full: GetTransactionByHashResult
  }> {

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url), this.chainID)

    const result: any = await web3.eth.getTransaction(txid)

    const input = result.input

    if (
      input.length !== 138 ||
      input.slice(2, 10) !== "a9059cbb"
    ) {
      throw "NO ERC20 TRANSFER";
    }
    const address = `0x${input.slice(34, 74)}`;
    const amount = parseInt(hexToDec(input.slice(74)));
    const token = result.to.toLowerCase();

    return {
      parsed: {
        address,
        amount,
        token
      },
      full: result
    }

  }

  parseERC20Transfer(transaction: ethers.Transaction): {
    address: string,
    amount: number,
    symbol: string,
    hash: string,
    sender: string,
  } {

    const input = transaction.data;

    if (
      input.length !== 138 ||
      input.slice(2, 10) !== "a9059cbb"
    ) {
      throw "NO ERC20 TRANSFER";
    }
    const address = `0x${transaction.data.slice(34, 74)}`;
    const amount = hexToDec(transaction.data.slice(74));
    const symbol = transaction.to;
    const sender = transaction.from;
    const hash = transaction.hash
    return { address, amount, symbol, hash, sender };
  }

  /**
   * 
   * Builds a new signed transaction to send USDC to a given address given the wallet private key.
   * This function does not transmit or broadcast the transaction and therefore no gas will
   * be spent until the transaction is sent by a subsequent call to sendSignedTransaction.
   * 
   * Example ERC20 Transfer: https://etherscan.io/tx/0xeda0433ebbb12256ef1c4ab0278ea0c71de4832b7edd65501cc445794ad1f46c
   * 
   */
  async buildERC20Transfer({ mnemonic, address, amount, providerURL, token }: {
    mnemonic: string, address: string, amount: number, providerURL: string, token: string
  }): Promise<Transaction> {

    console.log('provider', { url: this.providerURL, chainID: this.chainID })

    const provider = new ethers.providers.JsonRpcProvider(this.providerURL, this.chainID)

    const senderWallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider)

    let contract = new ethers.utils.Interface(ERC20_ABI)

    const data = contract.encodeFunctionData("transfer", [ address, amount ])

    const fees = await provider.getFeeData()

    const gasPrice: any = fees.gasPrice

    const transactionRequest = {
      gasPrice,
      to: token,
      data
    }

    const populatedTransactionRequest = await senderWallet.populateTransaction(transactionRequest)

    const signedTxHex = await senderWallet.signTransaction(populatedTransactionRequest)

    const transaction = this.decodeTransactionHex({ transactionHex: signedTxHex })

    const transfer = this.parseERC20Transfer(transaction)
    
    return { txhex: signedTxHex, txid: transfer.hash }
  }



}

interface GetTransactionByHashResult {
  accessList?: any[];
  blockHash: string;
  blockNumber: number;
  chainId?: string;
  from: string;
  gas: number;
  gasPrice: string;
  hash: string;
  input: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: number;
  r: string;
  s: string;
  to: string;
  transactionIndex: number;
  type?: number;
  v: string;
  value: string;
}

