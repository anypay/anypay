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

// https://chain.so/api

import axios from 'axios'

import { log } from '@/lib/log';

import { v4 as uuid } from 'uuid'

import { BroadcastTxResult } from '@/lib/plugin';

export interface SendTxResponse {
    status: "success";
    data: {
       network: string;
       txid: string
    }
}


export enum Networks {
    DOGE = 'DOGE',
    BTC = 'BTC',
    ZEC = 'ZEC',
    LTC = 'LTC',
    DASH = 'DASH',
    BTCTEST = 'BTCTEST',
    DASHTEST = 'DASHTEST',
    ZECTEST = 'ZECTEST',
    DOGETEST = 'DOGETEST',
    LTCTEST = 'LTCTEST'
}

export async function broadcastTx(currency: string, tx_hex: string): Promise<BroadcastTxResult> {

    const result = await send_tx(currency, tx_hex)

    const { data } = result

    return {
        
        success: true,

        txhex: tx_hex,

        txid: data.txid,

        result: data
    }
}

export async function send_tx(currency: string, tx_hex: string): Promise<SendTxResponse> {

  const trace = uuid()

  log.info('chain.so.api.v2.send_tx', { currency, tx_hex, trace })
  
  try {

    let response = await axios.post(`https://chain.so/api/v2/send_tx/${currency}`, {
      tx_hex
    });

    const { data } = response

    log.info('chain.so.api.v2.send_tx.response', { trace, data })

    if (response.status !== 200) {

        const error = new Error(response.data)

        log.error('chain.so.api.v2.send_tx.error', error)

        throw error

    }

    return response.data

  } catch(error: any) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('chain.so.api.v2.send_tx.error', error)

    throw error;

  }

}
