require('dotenv').config();

import * as http from 'superagent';

import { BITBOX } from 'bitbox-sdk'

let bitbox = new BITBOX();

const bch: any = require('bitcore-lib-cash');

export function getCashBackAddress() {

  let wif = process.env.CASHBACK_BCH_PRIVATE_KEY;

  let privkey = new bch.PrivateKey(wif);

  let address = privkey.toAddress();

  return address.toString();

}

export async function getCashBackBalance(): Promise<number> {

  let address = getCashBackAddress();

  return getAddressBalance(address);

}

export async function getAddressBalance(address: string): Promise<number> {

  let resp: any = await bitbox.Address.utxo(address);

  let sum = resp.utxos.reduce((sum, utxo) => {

    return sum + utxo.amount;

  }, 0);

  return sum;

}

export async function buildSendToAddress(destination: string, amountSatoshis: number): Promise<any> {

  let wif = process.env.CASHBACK_BCH_PRIVATE_KEY;

  let privkey = new bch.PrivateKey(wif);

  let keypair = bitbox.ECPair.fromWIF(wif)

  let address = privkey.toAddress();

  let tx = new bch.Transaction();

  let txBuilder = new bitbox.TransactionBuilder('mainnet')

  let result: any = await bitbox.Address.utxo(address.toString());

  let utxos = result.utxos.sort((a, b) => a.amount >= b.amount)
 
  let byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 });

  var sum = 0;

  let inputs = [];

  for (let utxo of utxos) {

    inputs.push(utxo);

    sum += utxo.satoshis;
  
    if (sum >= (amountSatoshis + byteCount)) {

      break; 
    }
  }

  let sumInputs = inputs.reduce((sum, i) => {
    return sum + i.satoshis
  }, 0)

  inputs.forEach(input => {

    txBuilder.addInput(input.txid, input.vout)

  })

  let redeemScript;

  txBuilder.addOutput(destination, amountSatoshis);

  let changeAmount = sumInputs - amountSatoshis - byteCount * 2;

  if (changeAmount > 0) {

    txBuilder.addOutput(address.toString(), changeAmount);

  }

  for (let i=0; i<inputs.length; i++) {
    txBuilder.sign(i, keypair, redeemScript, txBuilder.hashTypes.SIGHASH_ALL, inputs[i].satoshis);
  }

  return txBuilder.build();

}

export async function sendToAddress(address: string, satoshis: number): Promise<string>{

  console.log('cashback.bch.local.sendtoaddress', address, satoshis);

  let tx = await buildSendToAddress(address, satoshis);

  let hex = tx.toHex();

  console.log('cashback.bch.tx.hex', hex);

  let txid = await bitbox.RawTransactions.sendRawTransaction(hex)

  console.log('cashback.bch.txid', txid)

  return txid

}

async function callRpc(method, params): Promise<any> {

  let resp = await http
    .post(`http://${process.env.CASHBACK_BCH_RPC_HOST}:${process.env.CASHBACK_BCH_RPC_PORT}`)
    .auth(process.env.CASHBACK_BCH_RPC_USER, process.env.CASHBACK_BCH_RPC_PASSWORD)
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

