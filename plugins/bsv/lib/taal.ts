
import axios from 'axios'
import { log } from '../../../lib'
import { BroadcastTxResult } from '../../../lib/plugins'

class TaalBroadcastTransactionError extends Error {}

import { log } from '../../../lib/log'
import { BroadcastTransactionResult } from '../../../lib/plugins'

import { Trace } from '../../../lib/trace'

export async function getTransaction(txid: string): Promise<string> {

  let { data } = await axios.post(`https://api.taal.com/api/v1/bitcoin`, {
    "jsonrpc": "1.0",
    "id":"curltest",
    "method": "getrawtransaction",
    "params": [txid]
  }, {
    headers: {
      'Authorization': process.env.TAAL_API_KEY,
      'Content-Type': 'application/json'
    }
  })

  return data

}

export async function broadcastTransaction(tx_hex: string): Promise<BroadcastTransactionResult> {

  const trace = Trace()

  log.info('bsv.taal.broadcastTransaction', { tx_hex, trace })

  let { data } = await axios.post(`https://api.taal.com/api/v1/broadcast`, {
    tx_hex
  }, {
    headers: {
      'Authorization': process.env.TAAL_API_KEY,
      'Content-Type': 'application/json'
    }
  })

  log.info('bsv.taal.broadcastTransaction.result', { tx_hex, data, trace })

  return data

}
