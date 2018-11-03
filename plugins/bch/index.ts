require('dotenv').config();

var JSONRPC = require('./lib/jsonrpc');

import {generateInvoice} from '../../lib/invoice';

import {log} from '../../lib/logger';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import * as forwards from './lib/forwards';

import { createCoinTextInvoice } from '../../lib/cointext'

import { getLegacyAddressFromCashAddress } from './lib/bitbox'

import {statsd} from '../../lib/stats/statsd'

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let start = new Date().getTime()

  let paymentForward = await forwards.setupPaymentForward(settlementAddress);

  log.info('bch.paymentforward.created', paymentForward.toJSON());

  statsd.timing('BCH_generateInvoiceAddress', new Date().getTime()-start)

  statsd.increment('BCH_generateInvoiceAddress')

  return paymentForward.input_address;

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BCH');

  statsd.timing('BCH_createInvoice', new Date().getTime()-start)

  statsd.increment('BCH_createInvoice')

  return invoice;

}

async function validateAddress(address: string): Promise<string> {

  statsd.increment('validateAddress')

  let start = new Date().getTime()

  let resp = await rpc.call('validateaddress', [address]);

  if (!resp.result.isvalid) {
   
    statsd.increment('Invalid_BCH_Address')

    throw new Error('Invalid BCH address');

  }

  statsd.timing('BCH_validateAddress', new Date().getTime()-start)

  return resp.result.address;

}

async function checkAddressForPayments(address:string,currency:string){

  let start = new Date().getTime()
  
  let txs = await bitbox_checkAddressForPayments(address)

  console.log(txs)

  statsd.timing('BCH_checkAddressForPayments', new Date().getTime()-start)

  statsd.increment('BCH_checkAddressForPayments')

  return(txs)
}

async function generateCoinTextInvoice( address:string, amount:number, currency:string ){

  let legacy = getLegacyAddressFromCashAddress(address)
  
  let invoice =  await createCoinTextInvoice(legacy, amount, currency)

  return invoice
}

const currency = 'BCH';

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  validateAddress,

  generateCoinTextInvoice,

  forwards,

  rpc

};

