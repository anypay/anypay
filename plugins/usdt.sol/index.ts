
import { Plugin, BroadcastTx, BroadcastTxResult, Confirmation, Transaction, Payment } from '../../lib/plugin'

import { Connection, clusterApiUrl } from '@solana/web3.js'

//TODO: FinishPluginImplementation

export default class USDT_SOL extends Plugin {

  chain = 'SOL'

  currency = 'USDT'

  token = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'

  decimals = 6

  async parsePayments(txhex: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }



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

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    throw new Error()//TODO

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error()//TODO

  }

  async validateAddress(address: string): Promise<boolean> {

    throw new Error()//TODO

  }

  async verifyPayment(params): Promise<boolean> {

    throw new Error()//TODO

  }

}

