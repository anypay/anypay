
import { Connection, sendAndConfirmRawTransaction, clusterApiUrl, PublicKey } from '@solana/web3.js'

import axios from 'axios'

import { Transaction, Confirmation, BroadcastTx, BroadcastTxResult, Plugin } from '../../lib/plugin'

export default abstract class SolanaPlugin extends Plugin {

  providerURL: string;

  async getConfirmation(txid: string): Promise<Confirmation> {

    let connection = new Connection(clusterApiUrl("mainnet-beta"), "finalized");

    let signatureStatus = await connection.getSignatureStatus(txid, {
      searchTransactionHistory: true
    })

    console.log({ signatureStatus })

    const slot = signatureStatus.value.slot

    console.log({ slot })

    if (!slot) { return }

    let block: any = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 2
    });

    if (!block || !block.blockhash) { return }

    return {
      confirmation_hash: block.blockhash,
      confirmation_height: slot,
      confirmation_date: new Date(block.blockTime * 1000),
      confirmations: signatureStatus.context.slot - slot + 1
    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    const { data } = await axios.post(`https://api.mainnet-beta.solana.com`, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getTransaction",
      "params": [txid, "base64"]
    })

    const txhex = Buffer.from(data.result.transaction[0], 'base64').toString('hex')

    return {
      txhex,
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

  async validateAddress(address: string): Promise<boolean> {

    try {

      const owner = new PublicKey(address);

      if (!PublicKey.isOnCurve(owner.toBytes())) return false;
      if (!PublicKey.isOnCurve(owner.toString())) return false;

    } catch(error) {

      return false

    }

    return true

  }

}

