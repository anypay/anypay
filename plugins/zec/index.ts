import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {statsd} from '../../lib/stats/statsd'

import { log } from '../../lib/logger';

import * as forwards from './lib/forwards';


export async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

   let start = new Date().getTime()

   let paymentForward = await forwards.setupPaymentForward(settlementAddress);

   log.info('zec.paymentforward.created', paymentForward.toJSON());

   statsd.timing('ZEC_generateInvoiceAddress', new Date().getTime()-start)

   statsd.increment('ZEC_generateInvoiceAddress')

   return paymentForward.input_address;
 }

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  statsd.timing('ZEC_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEC_createInvoice')

  return invoice;

}

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
export async function checkAddressForPayments(address:string,currency:string){
  
  let start = new Date().getTime()

  let payments: Payment[]=[];

  let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${currency}/${address}`)
   
  for (let tx of resp.body.data.txs){

    let p: Payment = { 

      currency: currency,

      address: resp.body.data.address,

      amount: tx.value,

      hash: tx.txid

      };  

      payments.push(p)

      }

    statsd.timing('ZEC_checkAddressForPayments', new Date().getTime()-start)

    statsd.increment('ZEC_checkAddressForPayments')
    
    return payments 
}

