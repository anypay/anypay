import * as http from 'superagent';

require('dotenv').config();

export async function getHotWalletBalance():Promise<number>{

  let url = `https://insight.dash.org/insight-api/addr/${process.env.DASH_HOT_WALLET_ADDRESS}/?noTxList=1` 

  let result = (await http.get(url)).body

  return result.balance + result.unconfirmedBalance;

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

