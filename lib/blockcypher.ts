
import axios from 'axios'

let token = process.env.blockcypher_token;

import { log } from './log';

import { v4 as uuid } from 'uuid'
import { BroadcastTxResult } from './plugins';
import { config } from './config';

export async function publish(currency, hex): Promise<BroadcastTxResult> {

  const trace = uuid()

  log.info('blockcypher.publish', { currency, hex, trace })
  
  try {

    let response = await axios.post(`https://api.blockcypher.com/v1/${currency}/main/txs/push?token=${token}`, {
      tx: hex
    });

    const { data } = response

    log.info('blockcypher.publish.response', { trace, data })

    return {
      result: data,
      success: true,
      txid: data.tx.hash,
      txhex: hex
    }

  } catch(error) {

    const message = error.response.data.error

    error = new Error(message)

    error.trace = trace

    log.error('blockcypher.publish.error', error)

    throw error;

  }

}

export async function createNewBlockWebhook() {

  let { data } = await axios.post(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`, {
    event: 'new-block',
    url: `${config.get('API_BASE')}/api/v1/blockcypher/webhooks`,
    secret: process.env.blockcypher_webhook_secret
  })

  console.log('blockcypher.createNewBlockWebhook.response', data)

  return data

}

export async function getNewBlockWebhook() {  

  let { data } = await axios.get(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`)

  console.log('blockcypher.createNewBlockWebhook.response', data)

  return data.filter(hook => hook.event === 'new-block')[0]

}

export async function deleteNewBlockWebhook() {

  const webhook = await getNewBlockWebhook()

  if (!webhook) return

  let { data } = await axios.delete(`https://api.blockcypher.com/v1/btc/main/hooks?token=${token}`)

  console.log('blockcypher.createNewBlockWebhook.response', data)

  return data

}
