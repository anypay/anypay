
import * as bitcore from 'bitcore-lib-cash';

export { bitcore }

import { v4 as uuid } from 'uuid'

const bitcore_io = 'https://api.bitcore.io/api'

import axios from 'axios'

import { log } from '../../log'

import { Utxo } from '../../wallet'

import { BitcoreIoUtxo } from '../../bitcore_io'


export const rpc = {

    listUnspent: async (address: string, trace?: string): Promise<Utxo[]> => {

        trace =  trace || uuid()
 
        try {

            log.debug('bch.listUnspent.bitcore_io', { address, trace })

            if (address.match(/:/)) {
                address = address.split(':')[1]
            }

            const url = `${bitcore_io}/BCH/mainnet/address/${address}/?unspent=true`

            const response = await axios.get(url)

            const { data } = response

            log.debug('bch.listUnspent.bitcore_io.response', { address, trace, data: data })

            const utxos: BitcoreIoUtxo[] = data

            return utxos.map(utxo => {
                return {
                    scriptPubKey: utxo.script,
                    value: utxo.value,
                    txid: utxo.mintTxid,
                    vout: utxo.mintIndex
                }
            })

        } catch(error) {

            error.trace = trace

            log.error('bch.listUnspent.error', error)
            
            throw error

        }


    },

    getBalance: async (address) => {

        const trace = uuid()

        log.debug('bch.getBalance', { address, trace })

        const utxos: Utxo[] = await rpc.listUnspent(address, trace)

        const result = utxos.reduce((sum, utxo) => {

            return sum + utxo.value

        }, 0)

        log.debug('bch.getBalance.result', { address, trace, result })

        return result
        
    }

}