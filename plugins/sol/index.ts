
import { Transaction, Connection, PublicKey, Keypair, SystemInstruction } from '@solana/web3.js'

import {  VerifyPayment, Transaction as AnypayTransaction, Payment } from '../../lib/plugin'

import SolanaPlugin from '../../lib/plugins/solana'

//TODO: FinishPluginImplementation

export default class SOL extends SolanaPlugin {

  currency = 'SOL'

  chain = 'SOL'

  decimals = 10

  providerURL = process.env.solana_provider_url || "https://api.mainnet-beta.solana.com"

  connection: Connection;

  async parsePayments({ txhex }: AnypayTransaction): Promise<Payment[]> {

    const transaction: Transaction = Transaction.from(Buffer.from(txhex, 'hex'))

    const signature = transaction.signature.toString()

    const payments: Payment[] = transaction.instructions.map(instruction => {

        try {

            console.log(instruction)

            const decodedTransferInstruction = SystemInstruction.decodeTransfer(instruction)

            const { toPubkey, lamports } = decodedTransferInstruction

            const address = toPubkey.toString()

            const amount = Number(lamports)

            return {
              txid: signature, 
              address,
              amount,
              currency: this.currency,
              chain: this.chain
            }

        } catch(error) {

            console.debug(error)
        }

    }).filter((output: any) => !!output)

    return payments

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async verifyPayment({ paymentOption, transaction: {txhex}, protocol }: VerifyPayment): Promise<boolean> {

    const transaction = Transaction.from(Buffer.from(txhex, 'hex'))

    console.log(transaction)

    const validateResult = await validateTransaction({ template: [], txhex: txhex }) //TODO

    console.log(validateResult, 'validateResult')

    return true

  }

}

async function validateTransaction({template, txhex}: ValidateTransaction): Promise<[boolean, any | null]> {

    const errors = []

    const transaction: Transaction = Transaction.from(Buffer.from(txhex, 'hex'))

    const outputs: any[] = transaction.instructions.map(instruction => {

        try {

            console.log(instruction)

            const decodedTransferInstruction = SystemInstruction.decodeTransfer(instruction)

            const { toPubkey, lamports } = decodedTransferInstruction

            const address = toPubkey.toString()

            const amount = Number(lamports)

            return { address, amount }

        } catch(error) {

            console.debug(error)
        }

    }).filter((output: any) => !!output)

    console.log('--outputs--', outputs)

    for (let expectedOutput of template) {

        let destination = expectedOutput.address

        const matching = outputs.find((output: InstructionOutput) => {

            console.log('--output--', output)

            let expectedAmount = 1_000_000 * expectedOutput.amount

            return (destination === output.destination) && (expectedAmount === output.amount)

        })

        if (!matching) {

            errors.push(expectedOutput)
        }

    }

    if (errors.length > 0) {

        return [false, errors]

    } else {

        return [true, null]
    }

}


export async function getTokenAddress(accountAddress: string, token: PublicKey): Promise<string> {

    const connection = new Connection(process.env.solana_connection_url);

    const provider = Keypair.generate()

    var toTokenAccount: any = await getOrCreateAssociatedTokenAccount(
        connection,
        provider,
        token,
        new PublicKey(accountAddress)
    )
    console.log({ toTokenAccount }, toTokenAccount.address.toBase58())

  return toTokenAccount.address.toBase58()
}

function getOrCreateAssociatedTokenAccount(connection: any, provider: Keypair, token: PublicKey, arg3: any) {
    throw new Error('Function not implemented.');
}




interface Output {
    address: string;
    amount: number;
}

interface ValidateTransaction {
    template: Output[];
    txhex: string;
}

interface InstructionOutput {
    amount: number;
    source: string;
    destination: string;
    owner: string;
    programId: string;
}

