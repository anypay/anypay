import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {statsd} from '../../lib/stats/statsd'

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  statsd.timing('ZEC_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEC_createInvoice')

  return invoice;

}

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
async function checkAddressForPayments(address:string,currency:string){
  
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

const currency = 'ZEC';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};


 
