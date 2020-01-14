import * as http from 'superagent';

require('dotenv').config();

export async function getHotWalletBalance():Promise<number>{

  let url = `https://explorer.bitcoin.com/api/btc/addr/${process.env.BTC_HOT_WALLET_ADDRESS}` 
  return (await http.get(url)).body.balance;

}

export function getHotWalletAddress(){
  return process.env.BTC_HOT_WALLET_ADDRESS;
}

export function getCurrencyCode(){
  return "BTC";
}

export function getCurrencyName(){
  return "Bitcon Core"
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

