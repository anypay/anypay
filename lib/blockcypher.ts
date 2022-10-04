
import axios from 'axios'

let token = process.env.BLOCKCYPHER_TOKEN;

import { log } from './log';

import { v4 as uuid } from 'uuid'
import { BroadcastTransactionResult } from './plugins';

export async function publish(currency, hex): Promise<BroadcastTransactionResult> {

  const trace = uuid()

  log.info('blockcypher.publish', { currency, hex, trace })
  
  try {

    let response = await axios.post(`https://api.blockcypher.com/v1/${currency}/main/txs/push?token=${token}`, {
      tx: hex
    });

    const { data } = response

    log.info('blockcypher.publish.response', { trace, data })

    return {
      currency,
      result: data,
      success: true,
      tx_id: data.tx.hash,
      tx_hex: hex
    }

  } catch(error) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('blockcypher.publish.error', error)

    throw error;

  }

}
