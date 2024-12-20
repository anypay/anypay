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

import axios from 'axios'

import { config } from '@/lib/config'

import { log } from '@/lib/log'

import { BroadcastTxResult } from '@/lib/plugin'

import { Trace } from '@/lib/trace'

interface SendRawTransactionResult {
    result: string;
    error: string;
    id: string;
}

const hosts: {
    [key: string]: string

} = {
    'BTC': 'btc.nownodes.io'
}

export async function broadcastTx(currency: string, txhex: string): Promise<BroadcastTxResult> {

    const result = await sendRawTransaction(currency, txhex)

    return {
        success: true,
        txhex,
        txid: result.result,
        result
    }

}

export async function sendRawTransaction(currency: string, hex: string): Promise<SendRawTransactionResult> {

    const trace = Trace()

    try {

        const host = hosts[currency];

        if (!host) {
            throw new Error(`Currency ${currency} Not Yet Supported`)
        }

        log.info('nownodes.btc.sendRawTransaction', { currency, hex, trace})

        const { data } = await axios.post(`https://${hosts[currency]}`, {
            "API_key": config.get('NOWNODES_API_KEY'),
            "jsonrpc": "2.0",
            "id": trace,
            "method": "sendrawtransaction",
            "params": [
                hex
            ]
        })

        log.info('nownodes.btc.sendRawTransaction.result', {data, hex, currency, trace})

        return data

    } catch(error: any) {

        error.trace = trace

        log.error('nownodes.btc.sendRawTransaction.error', error)

        throw error

    }

}
