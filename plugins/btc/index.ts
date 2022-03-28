require('dotenv').config()
const btc = require('bitcore-lib')
import {generateInvoice} from '../../lib/invoice';

export { btc as bitcore }

import { fromSatoshis, Payment } from '../../lib/pay'

import { publishBTC } from '../../lib/blockchair'

import {models} from '../../lib/models';

import {oneSuccess} from 'promise-one-success'

import {rpc} from './jsonrpc';

import * as blockcypher from '../../lib/blockcypher'

export async function submitTransaction(rawTx: string) {

  return oneSuccess([
    publishBTC(rawTx),
    blockcypher.publishBTC(rawTx)
  ])

}

export async function broadcastTx(rawTx: string) {

  return oneSuccess([
    publishBTC(rawTx),
    blockcypher.publishBTC(rawTx)
  ])

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

  let invoice = await generateInvoice(accountId, amount, 'BTC');

  return invoice;

}

const currency = 'BTC';

const poll = false;

export {

  currency,

  createInvoice,

  poll

};
