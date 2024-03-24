
import  axios from 'axios'

type RPC_Response = any

import { BroadcastTxResult } from '../../lib/plugins'
import { config } from '../../lib'

export async function call({url,method,params,username,password}: {url: string, method: string, params: any[], username?: string, password?: string}): Promise<RPC_Response> {

  let response

  if (username && password) {

    response = await axios.post(url, {
      method, params
    }, {
      auth: { username, password }
    })

  } else {

    response = await axios.post(url, {
      method, params
    })

  }

  const result = response.data.result

  console.log('dash.rpc.call.result', { method, params, result })

  return result

}

export async function broadcastTx({ txhex }: {txhex: string}): Promise<BroadcastTxResult> {

  const txid = await call({
    url: config.get('DASH_RPC_URL'),
    method: 'sendrawtransaction',
    params: [txhex],
    username: config.get('DASH_RPC_USERNAME'),
    password: config.get('DASH_RPC_PASSWORD')
  })

  return {
    txid,
    txhex,
    success: true,
    result: txid
  }

}

export async function broadcastTx2({ txhex }: {txhex: string}): Promise<BroadcastTxResult> {

  const txid = await call({
    url: config.get('DASH_RPC_URL_2'),
    method: 'sendrawtransaction',
    params: [txhex],
    username: config.get('DASH_RPC_USERNAME'),
    password: config.get('DASH_RPC_PASSWORD')
  })

  return {
    txid,
    txhex,
    success: true,
    result: txid
  }

}

export async function broadcastTx3({ txhex }: {txhex: string}): Promise<BroadcastTxResult> {

  const txid = await call({
    url: config.get('DASH_RPC_URL_3'),
    method: 'sendrawtransaction',
    params: [txhex],
    username: config.get('DASH_RPC_USERNAME'),
    password: config.get('DASH_RPC_PASSWORD')
  })

  return {
    txid,
    txhex,
    success: true,
    result: txid
  }

}

