import * as http from 'superagent'

import { log } from './log'

import axios from 'axios'

import { getBitcore } from './bitcore'
import { BroadcastTxResult } from './plugins'

import { BroadcastTransactionResult } from './plugins'

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

export async function broadcastTx(currency:string, tx_hex: string): Promise<BroadcastTransactionResult> {

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let resp = await http.post(`https://api.blockchair.com/${currency}/push/transaction`).send({
      data: tx_hex
    });

    log.info(`blockchair.push.transaction.${currency}`, resp);

    const tx_id = resp.body.data.transaction_hash;

    return {
      tx_id,
      tx_hex,
      currency,
      chain: currency,
      success: true
    }

  } catch(error) {

    log.error(`blockchair.push.transaction.${currency}.error`, error);

    console.log(error)

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

  let { data: result } = await axios.get(`https://api.blockchair.com/${chain}/raw/transaction/${txid}`)

  const { data } = result

  log.info('blockchair.getDecodedTransaction.result', { chain, txid, result })

  console.log(data[txid].decoded_raw_transaction)

  return data[txid].decoded_raw_transaction
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

