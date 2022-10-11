
import axios from 'axios'

import { config } from './config'

import { log } from './log'
import { BroadcastTxResult } from './plugins'

import { Trace } from './trace'

interface SendRawTransactionResult {
    result: string;
    error: string;
    id: string;
}

const hosts = {
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
            "API_key": config.get('nownodes_api_key'),
            "jsonrpc": "2.0",
            "id": trace,
            "method": "sendrawtransaction",
            "params": [
                hex
            ]
        })

        log.info('nownodes.btc.sendRawTransaction.result', {data, hex, currency, trace})

        return data

    } catch(error) {

        error.trace = trace

        log.error('nownodes.btc.sendRawTransaction.error', error)

        throw error

    }

}
