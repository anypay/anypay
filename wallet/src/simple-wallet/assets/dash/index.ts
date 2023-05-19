import { log } from '../../log'

import { v4 as uuid } from 'uuid'

import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import axios from 'axios'

const insight = 'https://insight.dash.org/insight-api'

import { Utxo } from '../../wallet'

interface InsightUtxo {
    address: string;
    txid: string;
    vout: number;
    scriptPubKey: string;
    amount: number;
    satoshis: number;
    height: number;
    confirmations: number;
}

export const rpc = {

    listUnspent: async (address: string, trace?: string): Promise<Utxo[]> => {

        trace =  trace || uuid()

        log.debug('dash.listUnspent.insight', { address, trace })

        const response = await axios.get(`${insight}/addr/${address}/utxo`)

        log.debug('dash.listUnspent.insight.response', { address, trace, data: response.data })

        const utxos: InsightUtxo[] = response.data

        return utxos.map(utxo => {
            return {
                scriptPubKey: utxo.scriptPubKey,
                value: utxo.satoshis,
                txid: utxo.txid,
                vout: utxo.vout
            }
        })

    },

    getBalance: async (address) => {

        const trace = uuid()

        log.debug('dash.getBalance', { address, trace })

        const utxos: Utxo[] = await rpc.listUnspent(address, trace)

        return utxos.reduce((sum, utxo) => {

            return sum + utxo.value

        }, 0)
        
    }
}

