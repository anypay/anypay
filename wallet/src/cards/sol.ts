
import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import Provider from '../provider'

import PrivateKey from '../private_key'

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction as SolanaTransaction, SystemProgram } from '@solana/web3.js'

console.log({ LAMPORTS_PER_SOL })

import Card from '../cards/_base'

import * as bip39 from 'bip39'

export default class SOL extends Card {

  phrase: string;

  seed: Buffer;

  currency: string;

  chain: string;

  decimals = 10

  token: string;

  chainID: number;

  providerURL = process.env.solana_provider_url || "https://api.mainnet-beta.solana.com"

  privateKey: PrivateKey;

  address: string;

  connection: Connection;

  getPrivateKey(): PrivateKey {

    return this.privateKey

  }

  getAddress(): Promise<string> {

    return this.getPrivateKey().publicKey.toString()
  }

  get publicKey() {

    return this.privateKey.publicKey
  }

  async getBalance(): Promise<number> {

    let balance = await this.connection.getBalance(this.publicKey);
    console.log(`${balance / LAMPORTS_PER_SOL} SOL`);

    return balance

  }

  async buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction> {

    let tx = new SolanaTransaction()

    for (let output of paymentOption.instructions[0].outputs) {

      tx.add(
        SystemProgram.transfer({
          fromPubkey: this.publicKey,
          toPubkey: new PublicKey(output.address),
          lamports: output.amount,
        })
      );
    
    }

    tx.feePayer = this.publicKey;

    tx.sign(this.publicKey)

    const txhex = tx.serialize().toString('hex')

    const txid = tx.signature.toString('hex')

    return {
      txhex,
      txid
    }

  }

  get provider(): Provider {

    return this.connection

  }

  constructor({ phrase }: { phrase: string }) {

    super({ phrase })

    this.connection = new Connection(this.providerURL)

    this.privateKey = Keypair.fromSeed(this.seed.slice(0, 32));

  }


}

