import * as http from 'superagent'

import { log } from './log'

import axios from 'axios'

import { getBitcore } from './bitcore'

import { BroadcastTxResult } from './plugin'

const COIN_MAP = {
  'LTC': 'litecoin',
  'BTC': 'bitcoin',
  'BCH': 'bitcoin-cash',
  'BSV': 'bitcoin-sv',
  'DASH': 'dash',
  'ZEC': 'zcash',
  'DOGE': 'doge'
}

export const CURRENCIES = {
  'BSV': 'bitcoin-sv',
  'LTC': 'litecoin',
  'BTC': 'bitcoin',
  'BCH': 'bitcoin-cash',
  'DASH': 'dash',
  'ZEC': 'zcash',
  'DOGE': 'doge'
}

export async function publish(coin, hex): Promise<BroadcastTxResult> {

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let resp = await http.post(`https://api.blockchair.com/${coin}/push/transaction`).send({
      data: hex
    });

    log.info(`blockchair.push.transaction.${coin}`, resp);

    return {
      txhex: hex,
      txid: resp.body.data.transaction_hash,
      success: true,
      result: resp.body
    }

  } catch(error) {

    log.error(`blockchair.push.transaction.${coin}.error`, error);

    throw error;

  }

}

interface DecodedRawTransaction {
  txid: string;
  size: number;
  vsize: number;
  weight: number;
  vin: any[];
  vout: any[];
}

interface GetRawTransactionResult {
  decoded_raw_transaction: DecodedRawTransaction;
}

export async function getDecodedTransaction(chain: string, txid: string): Promise<DecodedRawTransaction> {

  log.info('blockchair.getDecodedTransaction', { chain, txid })

  let { data } = await axios.get(`https://api.blockchair.com/${chain}/raw/transaction/${txid}`)

  log.info('blockchair.getDecodedTransaction.result', { chain, txid, data: data.data })

  return data.data[txid].decoded_raw_transaction
}

export async function getRawTransaction(chain: string, txid: string): Promise<GetRawTransactionResult> {

  let { data } = await axios.get(`https://api.blockchair.com/${chain}/raw/transaction/${txid}`)

  return {
    decoded_raw_transaction: data[txid]
  }
}

export async function getTransaction(_coin, txid) {

  const coin = COIN_MAP[_coin]

  if (!coin) {
    throw new Error(`blockchair coin ${coin} not supported`)
  }

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let { data } = await axios.get(`https://api.blockchair.com/${coin}/raw/transaction/${txid}`)

    const bitcore = getBitcore(_coin)

    const tx = new bitcore.Transaction( data.data[txid].raw_transaction)

    return tx

  } catch(error) {
    
    log.error(`blockchair.transaction.get.${coin}.${txid}.error`, error);

    throw error;

  }

}

