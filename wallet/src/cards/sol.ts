
import Solana from './_solana'

import { Transaction, SystemProgram } from '@solana/web3.js'

import PaymentOption from '../payment_option'

export default class SOL extends Solana {

  currency = 'SOL'

  decimals = 9

  getBalance(): Promise<number> {

    return this.connection.getBalance(this.publicKey)

  }

  async buildSignedPayment(paymentOption: PaymentOption) {

    let blockhash = await this.connection.getRecentBlockhash();

    let transaction = new Transaction();

    for (let output of paymentOption.instructions[0].outputs) {

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.publicKey,
          toPubkey: output.address,
          lamports: output.amount,
        }),
      );

    }

    transaction = this.signTransaction(transaction)

    const txhex = transaction.serialize().toString('hex')

    const txid = transaction.signature.toString()

    return { txhex, txid }

  }

}

