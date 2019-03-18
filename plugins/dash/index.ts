
require('dotenv').config();

import {createWebhook} from './lib/blockcypher';

import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import {log, xpub, models} from '../../lib'

import * as rpc from './lib/jsonrpc';

import * as Blockcypher from '../../lib/dash/blockcypher';

import { I_Address } from '../../types/interfaces';

import * as http from 'superagent';

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  log.info('about to generate dash invoice');

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  log.info('generated dash invoice');

  statsd.timing('DASH_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DASH_createInvoice')

  return invoice;

}

async function createSubscription(address){

  let callbackBase = process.env.API_BASE || 'https://api.anypay.global';

  let url = `${callbackBase}/v1/subscriptions`;

  let resp = await http.post(url).send({

    currency: 'DASH',

    address: address,

    callback_url: `${callbackBase}/dash/address_subscription_callbacks`

  });

  return resp.body.result;

}

async function createAddressForward(record: I_Address) {

  let url = "https://dash.anypay.global/v1/dash/forwards";

  let callbackBase = process.env.API_BASE || 'https://api.anypay.global';

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: `${callbackBase}/dash/address_forward_callbacks`

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  var address;

  /* 
   * Example extended public key:
   *
   * xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS
   *
   * (stevenzeiler dash android wallet)
   *
   */

  if (record.value.match(/^xpub/)) {

    address = xpub.generateAddress('DASH', record.value, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

    await createWebhook('tx-confirmation', address);

  } else {

    if (process.env.OVERRIDE_BLOCKCYPHER_DASH) {

      let paymentEndpoint = await Blockcypher.createPaymentEndpoint(record.value);

      address = paymentEndpoint.input_address;

    } else {

      address = await createAddressForward(record);

    }
    
  }

  return address;

}

async function checkAddressForPayments(address:string, currency:string){

  log.info(`dash.checkAddressForPayments.${address}`);

  let start = new Date().getTime();

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  log.info(`dash.checkAddressForPayments.result`, payments);

  statsd.timing('DASH_checkAddressForPayments', new Date().getTime()-start);

  statsd.increment('DASH_checkAddressForPayments');

  return payments;
}

const currency = 'DASH';

const poll = true;

export {

  currency,

  checkAddressForPayments,

  poll,

  rpc

};
