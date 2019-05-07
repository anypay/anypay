require('dotenv').config();

import { rpc } from './lib/jsonrpc';

import * as http from 'superagent';

import {generateInvoice} from '../../lib/invoice';

import {log, models, xpub} from '../../lib';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import * as forwards from './lib/forwards';

import { createCoinTextInvoice } from '../../lib/cointext'

import { getLegacyAddressFromCashAddress } from './lib/bitbox'

import {statsd} from '../../lib/stats/statsd'

import { I_Address } from '../../types/interfaces';

var bchaddr = require('bchaddrjs');

import * as address_subscription from '../../lib/address_subscription';

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

function validateAddress(address: string){

  try{

    var isCashAddress = bchaddr.isCashAddress

    let valid = isCashAddress(address)

    return valid;
  }catch(error){

    return false;

  }


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

async function createAddressForward(record: I_Address) {

  let url = "https://bch.anypay.global/v1/bch/forwards";

  let callback_url = process.env.BCH_FORWARD_CALLBACK_URL || "https://bch.anypay.global/v1/bch/forwards";

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: callback_url

  });

  return resp.body.input_address;

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

    let subscription = await address_subscription.createSubscription('BCH', address)

    return address;

  } else {

    let address = await createAddressForward(record);

    return address;

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
