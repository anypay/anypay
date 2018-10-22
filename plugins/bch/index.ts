require('dotenv').config();

var JSONRPC = require('./lib/jsonrpc');

import {generateInvoice} from '../../lib/invoice';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import * as forwards from './lib/forwards';

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let response = await rpc.call('validateaddress', [settlementAddress]);

  if (response.result.isvalid) {

    return response.result.address;

  } else {

    throw new Error(`invalid address ${settlementAddress}`);

  }

}

async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'BCH');

  return invoice;

}

async function validateAddress(address: string): Promise<string> {

  let resp = await rpc.call('validateaddress', [address]);

  if (!resp.result.isvalid) {

    throw new Error('Invalid BCH address');

  }

  return resp.result.address;

}

async function checkAddressForPayments(address:string,currency:string){

  let txs = await bitbox_checkAddressForPayments(address)

  console.log(txs)

  return(txs)
}

const currency = 'BCH';

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  validateAddress,

  forwards

};

