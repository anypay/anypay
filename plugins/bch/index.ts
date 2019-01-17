require('dotenv').config();

var JSONRPC = require('./lib/jsonrpc');

import {generateInvoice} from '../../lib/invoice';

import {log, models, xpub} from '../../lib';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import * as forwards from './lib/forwards';

import { createCoinTextInvoice } from '../../lib/cointext'

import { getLegacyAddressFromCashAddress } from './lib/bitbox'

import {statsd} from '../../lib/stats/statsd'

import { I_Address } from '../../types/interfaces';

var rpc = new JSONRPC();

export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {
  var inputAddress;

  let start = new Date().getTime()

  statsd.increment('BCH_generateInvoiceAddress')

  if (settlementAddress.match(/^xpub/)) {

    // generate address from extended public key

  } else {

    // set up payment forward if enabled

    if (process.env.BCH_SUPPORT_FORWARDS) {

      let paymentForward = await forwards.setupPaymentForward(settlementAddress);

      log.info('bch.paymentforward.created', paymentForward.toJSON());

      statsd.timing('BCH_generateInvoiceAddress', new Date().getTime()-start);

      inputAddress = paymentForward.input_address;

    } else {

      throw new Error('BCH Forwards Not Supported');

    }
  }

  return inputAddress;

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

export async function getNewAddress(record: I_Address) {

  if (record.value.match(/^xpub/)) {

    var address = xpub.generateAddress('BCH', record.value, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

    return address;

  } else {

    //address = await bch.generateInvoiceAddress(account.bitcoin_cash_address);
    //
    // ( or if not enabled throw error )
    throw new Error('only extended public keys supported at this time');

  }

}

const currency = 'BCH';

const poll = true;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  validateAddress,

  generateCoinTextInvoice,

  forwards,

  rpc,

  poll

};

