import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {statsd} from '../../lib/stats/statsd'

import {generateInvoice} from '../../lib/invoice';

import { I_Address } from '../../types/interfaces';

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  statsd.timing('ZEC_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEC_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string,currency:string){

  let payments: Payment[]=[];

  let resp = (await http.post(`${process.env.ZEC_RPC_HOST}:${process.env.ZEC_RPC_PORT}`)
    .auth( process.env.ZEC_RPC_USER, process.env.ZEC_RPC_PASSWORD )
    .send({
        method: 'z_listreceivedbyaddress',
        params:  [address, 0]
    })).body.result
   

  console.log(resp)

  for (let tx of resp){

    let p: Payment = { 

      currency: currency,

      address: address,

      amount: tx.amount,

      hash: tx.txid

      };  

      payments.push(p)

  }

  return payments 

}

async function createAddressForward(record: I_Address) {

  let url = process.env.ZEC_FORWARDING_URL;

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: 'https://api.anypay.global/zec/address_forward_callbacks'

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  let address = await createAddressForward(record);

  return address;

}

const currency = 'ZEC';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};


 
