import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd' 

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
