import * as http from 'superagent';

require('dotenv').config();

export async function getHotWalletBalance():Promise<number>{

  return parseFloat((await walletrpc('getbalance', [])).confirmed)

}

export function getHotWalletAddress(){
  return process.env.DASH_HOT_WALLET_ADDRESS;
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

async function walletrpc(method, params) {

  let body = { jsonrpc: "2.0", method: method, params: params, id: 1 };

  let url = `http://${process.env.DASH_HOT_WALLET_HOST}:${process.env.DASH_HOT_WALLET_PORT}`;

  let resp = await http
    .post(url)
    .send(body)
    .auth(process.env.DASH_HOT_WALLET_USER, process.env.DASH_HOT_WALLET_PASSWORD);

  return resp.body.result;

}
