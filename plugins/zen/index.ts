require("dotenv").config();

import {generateInvoice} from '../../lib/invoice';

import {anypay_checkAddressForPayments} from './lib/checkAddressForPayments'

import {client} from '../../lib/statsd'

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEN');

  client.timing('ZEN_createInvoice', new Date().getTime()-start)

  client.increment('ZEN_createInvoice')

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string) {

  let start = new Date().getTime()

  let payments = await anypay_checkAddressForPayments(address, 'ZEN') 

  client.timing('ZEN_checkAddressForPayments', new Date().getTime()-start)

  client.increment('ZEN_checkAddressForPayments')

  return(payments)

}

