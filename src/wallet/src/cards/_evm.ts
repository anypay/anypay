
import Card from './_base'

import { ethers } from 'ethers'

interface EvmCardParams {
  phrase: string;
}

import { hexToDec } from 'hex2dec'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default abstract class EVM_Card extends Card {
  //@ts-ignore
  privateKey: any;

  constructor(params?: EvmCardParams) {

    const { phrase } = params || {}

    super({ phrase: String(params?.phrase) })

    if (phrase) {

      this.phrase = phrase
      //@ts-ignore
      this.privateKey = ethers.Wallet.fromPhrase(this.phrase)

      this.address = this.privateKey.address

    }

  }

  get provider() {

    return process.env.APP_ENV === 'browser' ? 
      //@ts-ignore
      new ethers.BrowserProvider(window.ethereum, this.chainID) :
      //@ts-ignore
      new ethers.JsonRpcProvider(this.providerURL, this.chainID)

  }

  async getBalance(): Promise<number> {

    const balance: bigint = await this.provider.getBalance(this.address)

    return Number(balance)

  }

  async getAddress(): Promise<string> {

    return String(this.address)
  }

  //@ts-ignore
  getPrivateKey(): ethers.HDNodeWallet {

    //@ts-ignore
    const wallet = ethers.Wallet.fromPhrase(this.phrase)

    wallet.connect(this.provider)

    return wallet

  }

  async buildSignedPayment(option: PaymentOption): Promise<Transaction> {

    if (option.instructions.length > 1) { throw new Error('ERC20 supports only one instruction') }

    const isBrowser: boolean = process.env.APP_ENV === 'browser'

    const provider = isBrowser ? 
      //@ts-ignore
      new ethers.BrowserProvider(window.ethereum, this.chainID) :
      //@ts-ignore
      new ethers.JsonRpcProvider(this.providerURL, this.chainID)
//@ts-ignore
    const wallet = ethers.Wallet.fromPhrase(this.phrase, provider)

    const [instruction] = option.instructions

    var to, amount;

    if (instruction.data) {

      // TODO: Parse to and amount from data instead
      to = instruction.to

      amount = BigInt(instruction.amount)

    } else if (instruction.outputs) {

      to = instruction.outputs[0].address
      amount = BigInt(instruction.outputs[0].amount)

    }

    const fees = await provider.getFeeData()

    const gasPrice: any = fees.gasPrice

    const transactionRequest = { 
      gasPrice,
      to,
      value: amount,
      chainId: this.chainID
    }

    const populatedTransactionRequest = await wallet.populateTransaction(transactionRequest)

    const signedTxHex = await wallet.signTransaction(populatedTransactionRequest)

    //@ts-ignore
    const transaction: ethers.Transaction = ethers.Transaction.from(signedTxHex)

    //@ts-ignore
    return { txhex: transaction.serialized, txid: transaction.hash }
  }

  parseERC20Transfer(transaction: ethers.Transaction): {
    receiver: string,
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
    const receiver = `0x${transaction.data?.slice(34, 74)}`;
    const amount = parseFloat(String(hexToDec(String(transaction.data?.slice(74)))));
    const symbol = transaction.to;
    const sender = transaction.from;
    const hash = transaction.hash

    return {
      receiver: String(receiver),
      amount: Number(amount),
      symbol: String(symbol),
      hash: String(hash),
      sender: String(sender)
    };
  }

  broadcastSignedTransaction(txhex: string) {

    //@ts-ignore
    return this.provider.send('eth_sendRawTransaction', [txhex])

  }



}
