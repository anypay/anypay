

import { UTXO } from './utxo'

import config from './config'

import axios from 'axios'

import { log } from './log'

class BlockchainInfoError extends Error {}

interface BlockchainInfoUTXO {
    tx_hash_big_endian: string;
    tx_hash: string;
    tx_output_n: number;
    script: string;
    value: number;
    value_hex: string;
    confirmations: number;
    tx_index: number;
}

export async function listUnspent(coin: string, address: string): Promise<UTXO[]> {

    if (coin !== 'BTC') {

        throw new BlockchainInfoError('Only BTC supported on blockchain.info')

    }

    try {

        const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}`)

        return data.unspent_outputs.map((output: BlockchainInfoUTXO) => {

            return {
                txid: output.tx_hash_big_endian,
                vout: output.tx_output_n,
                value: output.value,
                scriptPubKey: output.script
            }
        })

    } catch(err) {

        const error = new BlockchainInfoError(err.message)

        log.error('blockchain.info.api.error', error)

        throw error
    }
}
