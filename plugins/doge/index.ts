const http = require("superagent");

import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'DOGE');

  statsd.timing('DOGE_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DOGE_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string,currency:string){

    let start = new Date().getTime()

    let payments: Payment[]=[];

    console.log(`https://chain.so/api/v2/get_tx_received/currency/address`)

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

      statsd.timing('DOGE_checkAddressForPayments', new Date().getTime()-start)

      statsd.increment('DOGE_checkAddressForPayments')
    
      return payments 
}
const currency = 'DOGE';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};

