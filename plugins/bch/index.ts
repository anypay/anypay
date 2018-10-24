require('dotenv').config();

var JSONRPC = require('./lib/jsonrpc');

import {generateInvoice} from '../../lib/invoice';

import {log} from '../../lib/logger';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import * as forwards from './lib/forwards';

import {client} from '../../lib/statsd'

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let start = new Date().getTime()

  let paymentForward = await forwards.setupPaymentForward(settlementAddress);

  log.info('bch.paymentforward.created', paymentForward.toJSON());

  client.timing('BCH_generateInvoiceAddress', new Date().getTime()-start)

  client.increment('BCH_generateInvoiceAddress')

  return paymentForward.input_address;

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BCH');

  client.timing('BCH_createInvoice', new Date().getTime()-start)

  client.increment('BCH_createInvoice')

  return invoice;

}

async function validateAddress(address: string): Promise<string> {

  client.increment('validateAddress')

  let start = new Date().getTime()

  let resp = await rpc.call('validateaddress', [address]);

  if (!resp.result.isvalid) {
   
    client.increment('Invalid_BCH_Address')

    throw new Error('Invalid BCH address');

  }

  client.timing('BCH_validateAddress', new Date().getTime()-start)

  return resp.result.address;

}

async function checkAddressForPayments(address:string,currency:string){

  let start = new Date().getTime()
  
  let txs = await bitbox_checkAddressForPayments(address)

  console.log(txs)

  client.timing('BCH_checkAddressForPayments', new Date().getTime()-start)

  client.increment('BCH_checkAddressForPayments')

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

