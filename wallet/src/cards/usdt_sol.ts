
import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import Provider from '../provider'

import PrivateKey from '../private_key'

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction as SolanaTransaction, SystemProgram } from '@solana/web3.js'

import { createTransferCheckedInstruction, getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token';


console.log({ LAMPORTS_PER_SOL })

import Card from '../cards/_base'

import * as bip39 from 'bip39'

export default class USDC_SOL extends Card {

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

    const splToken = new PublicKey(this.token)

    const mint = await getMint(this.connection, splToken);

    const source = this.publicKey.toString()

    const owner = this.privateKey.toString()

    for (let output of paymentOption.instructions[0].outputs) {

      if (output.amount > 0) {

        const destination = new PublicKey(output.address)

        const instruction = createTransferCheckedInstruction(
          source,
          splToken,
          destination,
          owner,
          output.amount,
          mint.decimals,
          [this.privateKey],
          splToken
        )

        tx.add(instruction)

      }
    
    }

    /*
      From: https://github.com/anypay/paypow21/blob/9c3de9224643cc32ca6686f9dc3866e8f59db238/utils/solana/create_transaction.js#L9
      const mint = await getMint(connection, splToken);
        if (!mint.isInitialized) throw new CreateTransactionError('mint not initialized');

        // Check that the amount provided doesn't have greater precision than the mint
        if (amount.decimalPlaces() > mint.decimals) throw new CreateTransactionError('amount decimals invalid');

        // Convert input decimal amount to integer tokens according to the mint decimals
        amount = amount.times(TEN.pow(mint.decimals)).integerValue(BigNumber.ROUND_FLOOR);

        // Get the payer's ATA and check that the account exists and can send tokens
        const payerATA = await getAssociatedTokenAddress(splToken, payer);
        const payerAccount = await getAccount(connection, payerATA);
        if (!payerAccount.isInitialized) throw new CreateTransactionError('payer not initialized');
        if (payerAccount.isFrozen) throw new CreateTransactionError('payer frozen');

        // Get the recipient's ATA and check that the account exists and can receive tokens
        const recipientATA = await getAssociatedTokenAddress(splToken, recipient);
        const recipientAccount = await getAccount(connection, recipientATA);
        if (!recipientAccount.isInitialized) throw new CreateTransactionError('recipient not initialized');
        if (recipientAccount.isFrozen) throw new CreateTransactionError('recipient frozen');

        // Check that the payer has enough tokens
        const tokens = BigInt(String(amount));
        if (tokens > payerAccount.amount) throw new CreateTransactionError('insufficient funds');

        // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
        instruction = createTransferCheckedInstruction(payerATA, splToken, recipientATA, payer, tokens, mint.decimals);

    */

    tx.feePayer = this.publicKey;

    let blockhash = (await this.connection.getLatestBlockhash('finalized')).blockhash;
    tx.recentBlockhash = blockhash;

    tx.sign(this.privateKey)

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

