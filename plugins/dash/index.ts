import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

var rpc = require('./lib/jsonrpc').rpc;

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  statsd.timing('DASH_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DASH_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string){

  let start = new Date().getTime()

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  statsd.timing('DASH_checkAddressForPayments', new Date().getTime()-start)

  statsd.increment('DASH_checkAddressForPayments')

  return payments;
}

const currency = 'DASH';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll,

  rpc

};
