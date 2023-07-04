
import { Payment, Transaction as AnypayTransaction } from '../../lib/plugin'

import SolanaPlugin from '../../lib/plugins/solana'

import { Transaction } from '@solana/web3.js'

import { decodeTransferInstruction } from '@solana/spl-token';

//TODO: FinishPluginImplementation

export default class USDC_SOL extends SolanaPlugin {

  chain = 'SOL'

  currency = 'USDC'

  token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

  decimals = 6

  async parsePayments({txhex}: AnypayTransaction): Promise<Payment[]> {

    const transaction: Transaction = Transaction.from(Buffer.from(txhex, 'hex'))

    const payments: any[] = transaction.instructions.map(instruction => {

        try {

            console.log(instruction)

            const decoded = decodeTransferInstruction(instruction)

            console.log(decoded)

            const output: InstructionOutput = {
                amount: parseInt(decoded.data.amount.toString()),
                source: decoded.keys.source.pubkey.toBase58(),
                destination: decoded.keys.destination.pubkey.toBase58(),
                owner: decoded.keys.owner.pubkey.toBase58(),
                programId: decoded.programId.toBase58()
            }

            console.log(output)

            return output

        } catch(error) {

            console.debug(error)
        }

    }).filter((output: any) => !!output)

    return payments

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async verifyPayment(params): Promise<boolean> {

    throw new Error()//TODO

  }

}

interface InstructionOutput {
    amount: number;
    source: string;
    destination: string;
    owner: string;
    programId: string;
}

