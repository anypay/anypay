/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { log } from './log'

import axios from 'axios'

import { getBitcore } from './bitcore'

import { BroadcastTxResult } from './plugin'

const COIN_MAP: {
  [key: string]: string

} = {
  'LTC': 'litecoin',
  'BTC': 'bitcoin',
  'BCH': 'bitcoin-cash',
  'BSV': 'bitcoin-sv',
  'DASH': 'dash',
  'ZEC': 'zcash',
  'DOGE': 'doge'
}

export const CURRENCIES: {
  [key: string]: string

} = {
  'BSV': 'bitcoin-sv',
  'LTC': 'litecoin',
  'BTC': 'bitcoin',
  'BCH': 'bitcoin-cash',
  'DASH': 'dash',
  'ZEC': 'zcash',
  'DOGE': 'doge'
}

export async function publish(coin: string, hex: string): Promise<BroadcastTxResult> {

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let { data } = await axios.post(`https://api.blockchair.com/${coin}/push/transaction`, {
      data: hex
    });

    log.info(`blockchair.push.transaction.${coin}`, data);

    return {
      txhex: hex,
      txid: data.transaction_hash,
      success: true,
      result: data
    }

  } catch(error: any) {

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

export async function getTransaction(_coin: string, txid: string) {

  const coin = COIN_MAP[_coin as keyof typeof COIN_MAP];

  if (!coin) {
    throw new Error(`blockchair coin ${coin} not supported`);
  }

  /* litecoin, bitcoin, bitcoin-cash, bitcoin-sv, dash, zcash, ethereum, doge */

  try {

    let { data } = await axios.get(`https://api.blockchair.com/${coin}/raw/transaction/${txid}`)

    const bitcore = getBitcore(_coin)

    const tx = new bitcore.Transaction( data.data[txid].raw_transaction)

    return tx

  } catch(error: any) {
    
    log.error(`blockchair.transaction.get.${coin}.${txid}.error`, error);

    throw error;

  }

}

