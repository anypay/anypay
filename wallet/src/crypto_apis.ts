
import { UTXO } from './utxo'

import config from './config'

export async function listUnspent(coin: string, address: string): Promise<UTXO[]> {

    const key = config.get('crypto_apis_io_api_key')

    return []
}
