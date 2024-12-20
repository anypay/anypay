require('dotenv').config()

import axios from 'axios'

import { config, log } from '../../../lib'

import { BroadcastTxResult } from '../../../lib/plugin'

class TaalBroadcastTransactionError extends Error {}

export async function getTransaction(txid: string): Promise<string> {

  let { data } = await axios.post(`https://api.taal.com/api/v1/bitcoin`, {
    "jsonrpc": "1.0",
    "id":"curltest",
    "method": "getrawtransaction",
    "params": [txid]
  }, {
    headers: {
      'Authorization': config.get('TAAL_API_KEY'),
      'Content-Type': 'application/json'
    }
  })

  return data

}

export async function broadcastTransaction(rawTx: string): Promise<BroadcastTxResult> {

  log.info('bsv.taal.broadcastTransaction', { rawTx })

  let response = await axios.post(`https://api.taal.com/api/v1/broadcast`, {
    rawTx
  }, {
    headers: {
      'Authorization': config.get('TAAL_API_KEY'),
      'Content-Type': 'application/json'
    }
  })

  const { data } = response

  log.info('bsv.taal.broadcastTransaction.result', { rawTx, data })

  if (response.status > 300) {

    const error = new TaalBroadcastTransactionError(response.data)

    log.error('bsv.taal.broadcastTransaction.error', error)

    throw error
  }

  return {
    success: true,
    result: data,
    txid: data,
    txhex: rawTx
  }

}

