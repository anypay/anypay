

import { blockchair, blockcypher } from '../../lib'

import * as dash from '@dashevo/dashcore-lib';

import * as insight from './lib/insight'

import { BroadcastTx, BroadcastTxResult, Transaction, Plugin, Confirmation, Payment } from '../../lib/plugin'

import oneSuccess from 'promise-one-success'

import axios from 'axios'

const providerURL = String(process.env.getblock_dash_url)

export default class DASH extends Plugin {

  currency: string = 'DASH'

  chain: string = 'DASH'

  decimals: number = 8;

  providerURL = String(process.env.getblock_dash_url)

  get bitcore() {

    return dash

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation | null> {

    const transaction = await getRawTransaction(txid)

    if (!transaction.blockhash) { return null }

    const hash = transaction.blockhash

    const timestamp = new Date(transaction.blocktime * 1000)

    const depth = transaction.confirmations

    const block = await getBlock(hash)

    const height = block.height

    return {
      confirmation_height: height,
      confirmation_hash: hash,
      confirmation_date: timestamp,
      confirmations: depth
    }
    
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('dash', txhex),

      blockcypher.publish('dash', txhex),

      insight.broadcastTx(txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string): Promise<boolean> {

    try {

      new dash.Address(address)

      return true

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    throw new Error('plugin.dash.getTansaction(txid: string) not implemented')

  }

}

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

async function getRawTransaction(txid: string): Promise<GetRawTransactionResult> {

  const { data } = await axios.post(providerURL, {
    method: 'getrawtransaction',
    params: [txid, true]
  })

  return data.result

}

interface GetBlockResult {
  hash: string;
  height: number;
  time: number; 
}

async function getBlock(hash: string): Promise<GetBlockResult> {

  const { data } = await axios.post(providerURL, {
    method: 'getblock',
    params: [hash, 1]
  })

  return data.result

}



