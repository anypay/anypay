require('dotenv').config();

import { rpc } from './lib/jsonrpc';

import * as http from 'superagent';

let BITBOX = require('bitbox-sdk').BITBOX;

const bitbox = new BITBOX();

import {generateInvoice} from '../../lib/invoice';

import {awaitChannel} from '../../lib/amqp';

import {log, models, xpub} from '../../lib';

import {bitbox_checkAddressForPayments} from './lib/bitbox'

import { getLegacyAddressFromCashAddress } from './lib/bitbox'

import {statsd} from '../../lib/stats/statsd'

import { I_Address } from '../../types/interfaces';

const bch: any = require('bitcore-lib-cash');

var bchaddr: any = require('bchaddrjs');

export async function submitTransaction(rawTx: string) {

  return rpc.call('sendrawtransaction', [rawTx]);

}
export async function broadcastTx(hex: string) {

  return bitbox.RawTransactions.sendRawTransaction(hex);

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BCH');

  statsd.timing('BCH_createInvoice', new Date().getTime()-start)

  statsd.increment('BCH_createInvoice')

  return invoice;

}

function validateAddress(address: string){

  try {

    new bch.HDPublicKey(address);

    return true;

  } catch(error) {

    console.log(error.message);

  }

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

export async function getNewAddress(record: I_Address) {

  var address;

  if (record.value.match(/^xpub/)) {

    address = xpub.generateAddress('BCH', record.value, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

    return address;

  } else {

    return record.value;

  }

}

function deriveAddress(xkey, nonce){

  let address = new bch.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address

}


const currency = 'BCH';

const poll = true;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  validateAddress,

  rpc,

  poll

};
