require('dotenv').config()
import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd' 

import {HDKeyAddresses} from '../../lib/models';

import {rpc} from './jsonrpc';

const btc = require('bitcore-lib')

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'BTC')

  return valid;

}

export async function getNewAddress(deprecatedParam){

  //Create a new HDKeyAddress 
  let record = await HDKeyAddresses.create({

    currency:'BTC',

    xpub_key:process.env.BTC_XPUB_KEY

  })

  record.address = deriveAddress(process.env.BTC_XPUB_KEY, record.id)

  await record.save()

  await rpc.call('importaddress', [record.address, "", false, false])

  return record.address;

}

function deriveAddress(xkey, nonce){

  return btc.HDPublicKey(xkey).derive(nonce).publicKey.toAddress().toString()

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
