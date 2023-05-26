
import EVM_Card from './_evm'

import { hexToDec } from 'hex2dec'

import { ethers } from 'ethers'

import ERC20_ABI from '../erc20/abi'

import PaymentOption from '../payment_option'

import Transaction from '../transaction'

export default abstract class ERC20_Card extends EVM_Card {

  async getBalance(): Promise<number> {

    let contract = new ethers.Contract(this.token, ERC20_ABI, this.provider)

    return contract.balanceOf(await this.getAddress())
    
  }

  async buildSignedPayment(option: PaymentOption): Promise<Transaction> {

    if (option.instructions.length > 1) { throw new Error('ERC20 supports only one instruction') }
    
    const wallet = this.getPrivateKey()

    let contract = new ethers.Interface(ERC20_ABI)

    const [instruction] = option.instructions

    const data = contract.encodeFunctionData("transfer", [ instruction.to, instruction.amount ])

    const fees = await this.provider.getFeeData()

    const gasPrice: any = fees.gasPrice

    const transactionRequest = { 
      gasPrice,
      to: this.token,
      data
    }

    const populatedTransactionRequest = await wallet.populateTransaction(transactionRequest)

    const signedTxHex = await wallet.signTransaction(populatedTransactionRequest)

    const transaction: ethers.Transaction = ethers.Transaction.from(signedTxHex)

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
    const receiver = `0x${transaction.data.slice(34, 74)}`;
    const amount = parseFloat(hexToDec(transaction.data.slice(74)));
    const symbol = transaction.to;
    const sender = transaction.from;
    const hash = transaction.hash

    return {
      receiver,
      amount,
      symbol,
      hash,
      sender
    };
  }

}

