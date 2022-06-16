require('dotenv').config()

import * as http from "superagent";

import { log } from '../../../lib';

export async function call(method, params) {

  let body = { jsonrpc: "2.0", method: method, params: params, id: 1 };

  let url = process.env.DASH_RPC_URL

  let resp = await http
    .post(url)
    .send(body)
    .auth(process.env.DASH_RPC_USER, process.env.DASH_RPC_PASS);

  return resp.body.result;

}

export async function getTransaction(hash: string): Promise<any> {

  let rawtx = await call('getrawtransaction', [hash]); 

  let tx = await call('decoderawtransaction', [rawtx]);

  return tx;
  
}

export const rpc = {

  call: async (method: string, params: any[]): Promise<any> => {

    let body = { jsonrpc: "2.0", method: method, params: params, id: 1 };

    let url = process.env.DASH_RPC_URL

    let resp = await http
      .post(url)
      .send(body)
      .auth(process.env.DASH_RPC_USER, process.env.DASH_RPC_PASS);

    return resp.body.result;

  }

}

