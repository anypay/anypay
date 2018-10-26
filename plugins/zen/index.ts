require("dotenv").config();

import {generateInvoice} from '../../lib/invoice';

import {anypay_checkAddressForPayments} from './lib/checkAddressForPayments'

import {statsd} from '../../lib/statsd'

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEN');

  statsd.timing('ZEN_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEN_createInvoice')

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string) {

  let start = new Date().getTime()

  let payments = await anypay_checkAddressForPayments(address, 'ZEN') 

  statsd.timing('ZEN_checkAddressForPayments', new Date().getTime()-start)

  statsd.increment('ZEN_checkAddressForPayments')

  return(payments)

}

