import {generateInvoice} from '../../lib/invoice';

import {statsd} from '../../lib/stats/statsd'

const http = require("superagent");

import { connection, channel } from './lib/amqp';

import { Payment } from '../../types/interfaces'

const routing_key = 'payment';

const exchange = 'anypay.payments';

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

   await sleep(1500)

   let start = new Date().getTime()
      
   let payments: Payment[]=[];

   let resp = await http.get(`https://data.ripple.com/v2/accounts/${address}/transactions`)

   
   for(let i=resp.body.transactions.length-1; i>-1;i--){

console.log(resp.body.transactions[i])   
     if( i < resp.body.transactions.length - 25 ){ break }

     if(resp.body.transactions[i].tx.TransactionType == 'Payment'){

     let currency = 'XRP'

     let amount = resp.body.transactions[i].tx.Amount

      if( typeof(resp.body.transactions[i].tx.Amount.currency) != 'undefined'){

         currency = 'XRP.'+resp.body.transactions[i].tx.Amount.currency

       }
        if( typeof(resp.body.transactions[i].tx.Amount.value) != 'undefined' ){

         amount = resp.body.transactions[i].tx.Amount.value

       }

       let p: Payment = {
      
         currency: currency,
	 address: resp.body.transactions[i].tx.Account,
	 amount: amount,
	 hash: resp.body.transactions[i].hash

       }

       payments.push(p)

       channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));
       
      }
          
    }


   statsd.timing('XRP_checkAddressForPayments', new Date().getTime()-start)

   statsd.increment('XRP_checkAddressForPayments')

   return payments
}

const currency = 'XRP';


export {

  currency,

  createInvoice,

  checkAddressForPayments

};


