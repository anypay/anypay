


import { Transaction, Connection, PublicKey, Keypair, sendAndConfirmRawTransaction, clusterApiUrl } from '@solana/web3.js'

import { decodeTransferInstruction } from '@solana/spl-token';

import { Plugin, VerifyPayment, BroadcastTx, BroadcastTxResult, Confirmation, Transaction as AnypayTransaction } from '../../lib/plugin'

import axios from 'axios'

//TODO: FinishPluginImplementation

export default class SOL extends Plugin {

  currency = 'SOL'

  chain = 'SOL'

  decimals = 0 //TODO

  async getConfirmation(txid: string): Promise<Confirmation> {

    let connection = new Connection(clusterApiUrl("mainnet-beta"), "finalized");

    let signatureStatus = await connection.getSignatureStatus(txid, {
      searchTransactionHistory: true
    })

    const slot = signatureStatus.value.slot

    if (!slot) { return }

    let block: any = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 2
    });

    if (!block || !block.blockhash) { return }

    return {

      hash: block.blockhash,
      height: slot,
      timestamp: new Date(block.blockTime * 1000),
      depth: signatureStatus.context.slot - slot + 1
    }

  }

  async verifyPayment({ payment_option, transaction: {tx: hex}, protocol }: VerifyPayment): Promise<boolean> {

    const transaction = Transaction.from(Buffer.from(hex, 'hex'))

    console.log(transaction)

    const validateResult = await validateTransaction({ template: [], txhex: hex })

    console.log(validateResult, 'validateResult')

    return true

  }

  async validateAddress(address: string): Promise<boolean> {

    throw new Error() //TODO

  }

  async getTransaction(txid: string): Promise<AnypayTransaction> {

    const { data } = await axios.post(`https://api.mainnet-beta.solana.com`, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTransaction",
      "params": [txid, "base64"]
    })

    const hex = Buffer.from(data.result.transaction[0], 'base64').toString('hex')

    return {
      hex,
      txid
    }

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/zQCP8Bt8cAq63ToBYunRGWyag8HdzWp-');    

    const signature = await sendAndConfirmRawTransaction(connection, Buffer.from(txhex, 'hex'))

    console.log('solana.broadcast.response.signature', signature)

    return {
      txid: signature,
      txhex,
      success: true,
      result: signature
    }

  }

  async validateUnsignedTx(params: ValidateUnsignedTx): Promise<boolean> {

    console.log('SOLANA VALIDATE UNSIGNED TX', params)

    throw new Error() // TODO

  }

}

interface ValidateUnsignedTx {
    payment_option; any;
    transactions: any[];
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

class BitcoreTransaction {
    hex: string;
    transaction: Transaction;
    constructor(hex) {
        this.hex = hex
        this.transaction = Transaction.from(Buffer.from(hex, 'hex'))

    }

    get hash() {
        return this.transaction.signature.toString('hex')
    }
    toJSON() {
        return {
            hash: this.hash,
            hex: this.hex
        }
    }
}

class Bitcore {

    get Transaction() {
        return BitcoreTransaction
    }

}

const bitcore = new Bitcore()

export { bitcore }

async function validateTransaction({template, txhex}: ValidateTransaction): Promise<[boolean, any | null]> {

    const usdc = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")


    const errors = []

    const transaction: Transaction = Transaction.from(Buffer.from(txhex, 'hex'))

    const outputs: (InstructionOutput | undefined)[] | any[] = transaction.instructions.map(instruction => {

        try {

            let decoded = decodeTransferInstruction(instruction)

            const output: InstructionOutput = {
                amount: parseInt(decoded.data.amount.toString()),
                source: decoded.keys.source.pubkey.toBase58(),
                destination: decoded.keys.destination.pubkey.toBase58(),
                owner: decoded.keys.owner.pubkey.toBase58(),
                programId: decoded.programId.toBase58()
            }

            if (output) {

                console.log('solana.tx.output', output)
            }

            return output

        } catch(error) {

            console.debug(error)
        }

    }).filter((output: any) => !!output)


    for (let expectedOutput of template) {

        let destination = await getTokenAddress(expectedOutput.address, usdc)

        const matching = outputs.find((output: InstructionOutput) => {

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

    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/zQCP8Bt8cAq63ToBYunRGWyag8HdzWp-');    

    const provider = Keypair.generate()

    var toTokenAccount: any = await  getOrCreateAssociatedTokenAccount(
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

