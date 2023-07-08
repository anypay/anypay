
import Card from './_base'

import { Keypair, Connection, Transaction, SystemProgram } from '@solana/web3.js'

import { sign } from 'tweetnacl'

export default abstract class SolanaCard extends Card {

  chain = 'SOL'

  decimals = 9

  providerURL = process.env.solana_provider_url || 'https://api.mainnet-beta.solana.com'

  connection: Connection

  constructor(args: any) {

    super(args)

    this.connection = new Connection(this.providerURL)

  }

  get provider() {

    return this.connection
  }

  get publicKey() {

    const { publicKey }  = Keypair.fromSeed(this.seed.slice(0,32))

    return publicKey
  }

  getPrivateKey() {

    const keypair = Keypair.fromSeed(this.seed.slice(0, 32))

    return keypair.secretKey

  }

  async getAddress(): Promise<string> {

    const { publicKey }  = Keypair.fromSeed(this.seed.slice(0,32))

    return publicKey.toString()

  }

  getBalance(): Promise<number> {

    const { publicKey }  = Keypair.fromSeed(this.seed.slice(0,32))

    return this.connection.getBalance(publicKey)

  }

  signTransaction(transaction: Transaction): Transaction {

    let transactionBuffer = transaction.serializeMessage();

    let signature = sign.detached(transactionBuffer, this.getPrivateKey());

    //@ts-ignore
    transaction.addSignature(this.publicKey, signature); //@todo: fix ts-ignore

    return transaction

  }

}

