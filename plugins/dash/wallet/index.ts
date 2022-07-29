import * as http from 'superagent';

import {log} from '../../../lib';

require('dotenv').config();

export async function getHotWalletBalance():Promise<number>{

  log.info("dash.hot.wallet.getbalance");

  return (await walletrpc('getbalance', []))

}

export async function getHotWalletAddress(){

  log.info("dash.hot.wallet getaddress");

  return (await walletrpc('getnewaddress', []))
}

export function getCurrencyCode(){
  return "DASH";
}

export function getCurrencyName(){
  return "Dash"
}

export async function getHotWallet():Promise<any>{

  let currency = getCurrencyCode();
  let balance = await getHotWalletBalance();
  let deposit_address = await getHotWalletAddress();
  let name = getCurrencyName();

  return {
    "name": name,
    "currency": currency,
    "balance": balance,
    "deposit_address": deposit_address
  }

}

async function walletrpc(method, params):Promise<any>{

    return new Promise((resolve, reject) => {
      http
        .post(`https://${process.env.DASH_HOT_WALLET_HOST}:${process.env.DASH_HOT_WALLET_PORT}`)
        .auth(process.env.DASH_HOT_WALLET_USER, process.env.DASH_HOT_WALLET_PASSWORD)
        .timeout({
          response: 10000,  // Wait 5 seconds for the server to start sending,
          deadline: 10000, // but allow 1 minute for the file to finish loading.
        })
        .send({
          method: method,
          params: params || [],
          id: 0
        })
        .end((error, resp) => {
          if (error) { return reject(error) }
          resolve(resp.body.result)
        });
    });

}
