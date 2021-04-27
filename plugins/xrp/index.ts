import {generateInvoice} from '../../lib/invoice';

import {statsd} from '../../lib/stats/statsd'

const http = require("superagent");

import { connection, channel } from './lib/amqp';

import { Payment } from '../../types/interfaces'

import { rippleLib_checkAddressForPayments } from './lib/ripple_restAPI'

const routing_key = 'payment';

const exchange = 'anypay.payments';

import {models} from '../../lib' 

var WAValidator = require('anypay-wallet-address-validator');

export async function getNewAddress(params){

  return params.value;

}

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'XRP')

  return valid;

}

async function generateInvoiceAddress(accountId){

  let address = (await models.Address.findOne({ where: {
	  currency: 'XRP',
	  account_id: accountId
  }})).value;


  if (!address) {

    throw new Error('no XRP address');

  }

  return address+'?dt='+Math.floor(Math.random() * (10000000 - 0) + 0)

}

async function createInvoice(accountId: number, amount: number) {
  
  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'XRP');
  
  statsd.timing('XRP_createInvoice', new Date().getTime()-start)

  statsd.increment('XRP_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string){

   if( address.length < 34 ){
    
     console.log("invalid address:", address)

     return [];
   }
 
   address = address.substr(0, 34);

   let start = new Date().getTime()
  
   let payments = await rippleLib_checkAddressForPayments(address);

   statsd.timing('XRP_checkAddressForPayments', new Date().getTime()-start)

   statsd.increment('XRP_checkAddressForPayments')

   return payments;

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

