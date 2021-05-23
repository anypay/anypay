require('dotenv').config()
const btc = require('bitcore-lib')
import {generateInvoice} from '../../lib/invoice';

import * as http from 'superagent'

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd' 

import { publishBTC } from '../../lib/blockchair'

import {models} from '../../lib/models';

import {oneSuccess} from 'promise-one-success'

import {rpc} from './jsonrpc';

export async function submitTransaction(rawTx: string) {

  return oneSuccess([
    publishBTC(rawTx),
    publishBlockcypherBTC(rawTx)
  ])

}

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    publishBTC(rawTx),
    publishBlockcypherBTC(rawTx)
  ])

}

export async function publishBlockcypherBTC(hex) {

  let token = process.env.BLOCKCYPHER_TOKEN;

  try {

    let resp = await http.post(`https://api.blockcypher.com/v1/btc/main/txs/push?token=${token}`).send({
      tx: hex
    });

    return resp.body.hash;

  } catch(error) {

    console.log(error);

    throw error;

  }

}

export function transformAddress(address: string) {

  if (address.match(':')) {

    address = address.split(':')[1]

  }

  return address;

}

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  try {

    new btc.Address(address)
  
    return true

  } catch(error) {

    throw new Error('Invalid BTC address. SegWit addresses not supported. Use 1 or 3-style addresses.')

  }

}

export async function getNewAddress(deprecatedParam){

  return deprecatedParam.value;

}

function deriveAddress(xkey, nonce){

  let address = new btc.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address 

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BTC');

  statsd.timing('BTC_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEN_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string){

  let start = new Date().getTime()

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  statsd.timing('BTC_checkAddressForPayments', new Date().getTime()-start)

  statsd.increment('BTC_checkAddressForPayments')

  return payments;
}

const currency = 'BTC';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};
