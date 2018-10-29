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

async function checkAddressForPayments(address:string, currency:string){

   let start = new Date().getTime()
      
   let payments: Payment[]=[];

   let resp = await http.get(`https://data.ripple.com/v2/accounts/${address}/transactions`)
   
   for(let i=0;i<resp.body.transactions.length;i++){
	   
     if(resp.body.transactions[i].tx.TransactionType == 'Payment'){

       let p: Payment = {
      
         currency: resp.body.transactions[i].tx.Amount.currency,
	 address: resp.body.transactions[i].tx.Account,
	 amount: resp.body.transactions[i].tx.Amount.value,
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


