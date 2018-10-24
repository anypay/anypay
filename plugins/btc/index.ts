import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {client} from '../../lib/statsd' 

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BTC');

  client.timing('BTC_createInvoice', new Date().getTime()-start)

  client.increment('ZEN_createInvoice')

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string){

  let start = new Date().getTime()

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  client.timing('BTC_checkAddressForPayments', new Date().getTime()-start)

  client.increment('BTC_checkAddressForPayments')

  return payments;
}
