const http = require("superagent")

import {generateInvoice} from '../../lib/invoice';;

import {Payment,Invoice} from '../../types/interfaces';

import {client} from '../../lib/statsd'

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'LTC');

  client.timing('LTC_createInvoice', new Date().getTime()-start)
  
  client.increment('LTC_createInvoice')

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string){
  
  let start = new Date().getTime()

  let payments: Payment[]=[];

  let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${currency}/${address}`)

  for (let tx of resp.body.data.txs){

    let p: Payment = { 
 
      currency: currency,

      address: address,

      amount: tx.value,

      hash: tx.txid

      };  

      payments.push(p)

      }

    client.timing('LTC_checkAddressForPayments', new Date().getTime()-start)

    client.increment('LTC_checkAddressForPayments')


      return payments;
}

