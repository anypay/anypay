require('dotenv').config();

import * as http from 'superagent';

export async function getCashBackBalance() {

  return (await callRpc('getbalance', [])).result;

}

async function callRpc(method, params): Promise<any> {

  let resp = await http
    .post(`http://${process.env.CASHBACK_DASH_RPC_HOST}:${process.env.CASHBACK_DASH_RPC_PORT}`)
    .auth(process.env.CASHBACK_DASH_RPC_USER, process.env.CASHBACK_DASH_RPC_PASSWORD)
    .timeout({
      response: 10000,  // Wait 10 seconds for the server to start sending,
      deadline: 10000, // but allow 1 minute for the file to finish loading.
    })
    .send({
      method: method,
      params: params || [],
      id: 0
    })

  return resp.body;
}

