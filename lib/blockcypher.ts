
import axios from 'axios'

let token = process.env.BLOCKCYPHER_TOKEN;

import { log } from './log';

import { v4 as uuid } from 'uuid'

export async function publish(currency, hex) {

  const trace = uuid()

  log.info('blockcypher.publish', { currency, hex, trace })
  
  try {

    let { data } = await axios.post(`https://api.blockcypher.com/v1/${currency}/main/txs/push?token=${token}`, {
      tx: hex
    });

    log.info('blockcypher.publish.response', { trace, data })

    return data.hash;

  } catch(error) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('blockcypher.publish.error', error)

    throw error;

  }

}
