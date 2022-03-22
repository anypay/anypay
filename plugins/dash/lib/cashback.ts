require('dotenv').config();

import { log } from '../../../lib/log'

import * as http from 'superagent';

const dash = require("@dashevo/dashcore-lib")

import { BigNumber } from 'bignumber.js';

export async function getCashBackBalance(address) {
  try {

    let unspent = await callRpc('listunspent', [0, 9999999, [address]])

    return unspent.result.reduce((sum, output) => {
      return sum + output.amount 
    }, 0)

  } catch(error) {

    log.error('plugins.dash.cashback.error', error);
  }


}

export async function _sendToAddress(address: string, amount: number): Promise<string>{

  let privkey = new dash.PrivateKey(process.env.CASHBACK_DASH_PRIVATE_KEY);

  let _address = privkey.toAddress();

  let response = await callRpc('listunspent', [0, 9999999, [_address.toString()]])

  let utxos = response.result.sort((a, b) => a.amount >= b.amount)

  var sum = new BigNumber(0);

  var byteCount = 0;

  let inputs = [];
  let fee = new BigNumber(0.00012).times(100000000)

  for (let utxo of utxos) {

    inputs.push(utxo);

    sum = sum.plus(new BigNumber(utxo.amount));
  
    if (sum.toNumber() >= (amount + fee.toNumber())) {

      break; 
    }
  }

  let sumInputs = inputs.reduce((sum, i) => {
    return sum.plus(new BigNumber(i.amount))
  }, new BigNumber(0))

  let changeAmount = sumInputs.minus(amount);

  let tx = new dash.Transaction()
    .from(inputs)
    .to(address, new BigNumber(amount).times(100000000).toNumber())
    .fee(fee.toNumber())
    .change(_address)
    .sign(privkey)

  let broadcastResult = await callRpc('sendrawtransaction', [tx.toString()])

  return broadcastResult.result;

}

export async function buildSendToAddress(destination: string, amountSatoshis: number): Promise<any> {

  let wif = process.env.CASHBACK_DASH_PRIVATE_KEY;

  let privkey = new dash.PrivateKey(wif);

  let address = privkey.toAddress();

  let tx = new dash.Transaction();

}

export async function sendToAddress(address, amount) {

  let response = await callRpc('sendtoaddress', [address, amount]);

  return response.result;

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

