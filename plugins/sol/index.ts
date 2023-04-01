
import { Transaction, Connection, PublicKey, Keypair, sendAndConfirmRawTransaction} from '@solana/web3.js'

import { decodeTransferInstruction } from '@solana/spl-token';

interface ValidateUnsignedTx {
    payment_option; any;
    transactions: any[];
}

export async function validateUnsignedTx(params: ValidateUnsignedTx) {

    console.log('SOLANA VALIDATE UNSIGNED TX', params)

}

interface VerifyPayment {
    payment_option: any;
    transaction: {
        tx: string;
    };
    protocol: string;
}

export async function verifyPayment({ payment_option, transaction: {tx: hex}, protocol }: VerifyPayment) {

    const transaction = Transaction.from(Buffer.from(hex, 'hex'))

    console.log(transaction)

    const validateResult = await validateTransaction({ template: [], txhex: hex })

    console.log(validateResult, 'validateResult')

    return true

}

export async function broadcastTx(txhex: string) {

    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/zQCP8Bt8cAq63ToBYunRGWyag8HdzWp-');    

    const signature = await sendAndConfirmRawTransaction(connection, Buffer.from(txhex, 'hex'))

    console.log('solana.broadcast.response.signature', signature)

    return signature

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

