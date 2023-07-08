

import Solana from './_solana'

import { Transaction, PublicKey } from '@solana/web3.js'

import { createTransferCheckedInstruction } from "@solana/spl-token";

import PaymentOption from '../payment_option'

export default class SPL extends Solana {

  async getBalance(): Promise<number> {

    return this.connection.getBalance(this.publicKey)

    const tokenAccountBalance = await this.connection.getTokenAccountBalance(this.publicKey)

    const { decimals, amount } = tokenAccountBalance.value

    return parseInt(amount)

  }

  async buildSignedPayment(paymentOption: PaymentOption) {

    let recentBlockhash = await this.connection.getRecentBlockhash();

    let transaction = new Transaction();

    for (let output of paymentOption.instructions[0].outputs) {

      transaction.add(
        createTransferCheckedInstruction(
          this.publicKey, // from
          new PublicKey(this.token), // mint
          output.address, // to
          this.publicKey, // from's owner
          output.amount,
          0
        )
      );

    }

    transaction = this.signTransaction(transaction)

    const txhex = transaction.serialize().toString('hex')

    const txid = transaction.signature.toString()

    return { txhex, txid }

  }

}

