
// https://chain.so/api

import axios from 'axios'

import { log } from './log';

import { v4 as uuid } from 'uuid'
import { BroadcastTransactionResult } from './plugins';

export interface SendTxResponse {
    status: "success";
    data: {
       network: string;
       txid: string
    }
}

export class SendTxError extends Error {
    status: "fail";
    data: {
        network: string;
        tx_hex: string;
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

export async function broadcastTx(currency: string, tx_hex: string): Promise<BroadcastTransactionResult> {

    const result = await send_tx(currency, tx_hex)

    const { data } = result

    return {
        
        success: true,

        tx_hex: tx_hex,

        tx_id: data.txid,

        result: data,
        
        currency
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

        const error = new SendTxError(response.data)

        console.error('ERROR__', error)

        log.error('chain.so.api.v2.send_tx.error', error)

        throw error

    }

    return response.data

  } catch(error) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('chain.so.api.v2.send_tx.error', error)

    throw error;

  }

}
