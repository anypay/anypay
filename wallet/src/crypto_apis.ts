
import { Utxo } from './simple-wallet/src/wallet'

import config from './config'

export async function listUnspent(coin: string, address: string): Promise<Utxo[]> {

    const key = config.get('crypto_apis_io_api_key')

    return []
}