import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {client} from '../../lib/statsd'

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  client.timing('ZEC_createInvoice', new Date().getTime()-start)

  client.increment('ZEC_createInvoice')

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

    client.timing('ZEC_checkAddressForPayments', new Date().getTime()-start)

    client.increment('ZEC_checkAddressForPayments')
    
    return payments 
}

