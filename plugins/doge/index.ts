const http = require("superagent");

import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import * as blockchair from '../../lib/blockchair';

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DOGE')

  return valid;

}

export async function getNewAddress(record) {
  return record.value;
}

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'DOGE');

  statsd.timing('DOGE_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DOGE_createInvoice')

  return invoice;

}

export async function submitTransaction(rawTx: string) {

  return blockchair.publish('dogecoin', rawTx)

}
export async function broadcastTx(rawTx: string) {

  return blockchair.publish('dogecoin', rawTx)

}

const currency = 'DOGE';

export {

  currency

}

