
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import { Plugin, Transaction, BroadcastTx, Confirmation, BroadcastTxResult, VerifyPayment } from '../../lib/plugin'

import { log } from '../../lib';

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

import { oneSuccess } from 'promise-one-success'

//import { getDecodedTransaction } from '../../lib/blockchair'

//import * as moment from 'moment'

//TODO: FinalizePlugin

import axios from 'axios'


export default class BCH extends Plugin {

  currency: string = 'BCH'

  chain: string = 'BCH'

  decimals: number = 8;

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getRawTransaction(txid)

    if (!transaction.blockhash) { return }

    const hash = transaction.blockhash

    const timestamp = new Date(transaction.blocktime * 1000)

    const depth = transaction.confirmations

    const block = await getBlock(hash)

    const height = block.height

    return {
      hash,
      height,
      depth,
      timestamp
    }
    
  }



  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('bitcoin-cash', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new bch.HDPublicKey(address);

      log.debug('plugins.bch.hdpublickey.valid', address)

      return true;

    } catch(error) {

      log.debug('plugins.bch.hdpublickey.invalid', error)

    }

    try {

      var isCashAddress = bchaddr.isCashAddress

      let valid = isCashAddress(address)

      return valid;

    } catch(error) {

      return false;

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { hex: '' }
  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
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

  const { data } = await axios.post(process.env.getblock_bch_url, {
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

  const { data } = await axios.post(process.env.getblock_bch_url, {
    method: 'getblock',
    params: [hash, 1]
  })

  return data.result

}

