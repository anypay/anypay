import * as http from 'superagent'

import { log } from './log'

import axios from 'axios'

export async function publishBTC(hex) {

  try {

    let resp = await http.post(`https://api.blockchair.com/bitcoin/push/transaction`).send({
      data: hex
    });

    log.info('blockchair.push.transcation.btc', resp);

    return resp.body.data.transaction_hash;

  } catch(error) {

    log.error('blockchair.push.transaction.btc.error', error);

    throw error;

  }

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

export async function publish(coin, hex) {

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let resp = await http.post(`https://api.blockchair.com/${coin}/push/transaction`).send({
      data: hex
    });

    log.info(`blockchair.push.transcation.${coin}`, resp);

    return resp.body.data.transaction_hash;

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

  let { data } = await axios.get(`https://api.blockchair.com/${chain}/raw/transaction/${txid}`)

  console.log(data.data[txid].decoded_raw_transaction)

  return data.data[txid].decoded_raw_transaction
}

export async function getRawTransaction(chain: string, txid: string): Promise<GetRawTransactionResult> {

  let { data } = await axios.get(`https://api.blockchair.com/${chain}/raw/transaction/${txid}`)

  return {
    decoded_raw_transaction: data[txid]
  }
}


