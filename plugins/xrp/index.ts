import {generateInvoice} from '../../lib/invoice';

import {statsd} from '../../lib/stats/statsd'

const http = require("superagent");

import { connection, channel } from './lib/amqp';

import { Payment } from '../../types/interfaces'

import { rippleLib_checkAddressForPayments, ripple_restAPI_checkAddressForPayments } from './lib/ripple_restAPI'

const routing_key = 'payment';

const exchange = 'anypay.payments';

async function generateInvoiceAddress(settlementAddress:string){

  return settlementAddress+'?dt='+Math.floor(Math.random() * (10000000 - 0) + 0)

}

async function createInvoice(accountId: number, amount: number) {
  
  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'XRP');
  
  statsd.timing('XRP_createInvoice', new Date().getTime()-start)

  statsd.increment('XRP_createInvoice')

  return invoice;

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkAddressForPayments(address:string, currency:string){

   if( address.length <= 34 ){
    
     console.log("invalid address:", address)

     return [];
   }
 
   address = address.substr(0, 34);

   await sleep(2000)

   let start = new Date().getTime()
  
   rippleLib_checkAddressForPayments(address)

   let payments = await ripple_restAPI_checkAddressForPayments(address)

   statsd.timing('XRP_checkAddressForPayments', new Date().getTime()-start)

   statsd.increment('XRP_checkAddressForPayments')

   return payments
}

const currency = 'XRP';

const poll = true;

export {

  generateInvoiceAddress,

  currency,

  createInvoice,

  checkAddressForPayments,

  poll
};

