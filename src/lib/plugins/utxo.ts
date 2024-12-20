
import axios from 'axios'

import { Plugin } from '@/lib/plugin'

import { Confirmation } from '@/lib/confirmations'

interface GetRawTransactionResult {
  txid: string;
  hash: string;
  version: number;
  size: number;
  locktime: number;
  vin: any[];
  vout: any[];
  hex: string;
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}
interface GetBlockResult {
  hash: string;
  height: number;
  time: number; 
}
export default abstract class UTXOPlugin extends Plugin {

  providerURL: string | undefined;

  async getConfirmation(txid: string): Promise<Confirmation | null> {

    const transaction = await this.getRawTransaction(txid)

    if (!transaction.blockhash) { return null }

    const hash = transaction.blockhash

    const timestamp = new Date(transaction.blocktime * 1000)

    const depth = transaction.confirmations

    const block = await this.getBlock(hash)

    const height = block.height

    return {
      confirmation_height: height,
      confirmation_hash: hash,
      confirmation_date: timestamp,
      confirmations: depth
    }
    
  }


  async getRawTransaction(txid: string): Promise<GetRawTransactionResult> {

    if (!this.providerURL) {
      throw new Error('providerURL is not set')
    }

    const { data } = await axios.post(this.providerURL, {
      method: 'getrawtransaction',
      params: [txid, true]
    })

    return data.result

  }

  async getBlock(hash: string): Promise<GetBlockResult> {

    if (!this.providerURL) {
      throw new Error('providerURL is not set')
    }

    const { data } = await axios.post(this.providerURL, {
      method: 'getblock',
      params: [hash, 1]
    })

    return data.result

  }

}

