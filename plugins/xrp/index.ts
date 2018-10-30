import {generateInvoice} from '../../lib/invoice';

import {statsd} from '../../lib/stats/statsd'

const http = require("superagent");

import { connection, channel } from './lib/amqp';

import { Payment } from '../../types/interfaces'

import { ripple_restAPI_checkAddressForPayments } from './lib/ripple_restAPI'

const routing_key = 'payment';

const exchange = 'anypay.payments';

async function generateInvoiceAddress(settlementAddress:string){

  return settlementAddress+'?dt='+(Math.random() * 1000000000000).toString()

}

async function createInvoice(accountId: number, amount: number) {
  
  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'XRP');
  
  statsd.timing('XRP_createInvoice', new Date().getTime()-start)

  statsd.increment('XRP_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string){

   let start = new Date().getTime()
      
   let payments = await ripple_restAPI_checkAddressForPayments(address)

   statsd.timing('XRP_checkAddressForPayments', new Date().getTime()-start)

   statsd.increment('XRP_checkAddressForPayments')

   return payments
}

const currency = 'XRP';


export {

  generateInvoiceAddress,

  currency,

  createInvoice,

  checkAddressForPayments

};


