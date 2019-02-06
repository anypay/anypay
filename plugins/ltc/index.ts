const http = require("superagent")

import {generateInvoice} from '../../lib/invoice';;

import {Payment,Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import * as forwards from './lib/forwards';

import {generateInvoice} from '../../lib/invoice';

import { I_Address } from '../../types/interfaces';

async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let start = new Date().getTime()

  let paymentForward = await forwards.setupPaymentForward(settlementAddress);

  return paymentForward.input_address;

}


async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'LTC');

  statsd.timing('LTC_createInvoice', new Date().getTime()-start)
  
  statsd.increment('LTC_createInvoice')

  return invoice;

}

async function checkAddressForPayments(address:string, currency:string){
  
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

    statsd.timing('LTC_checkAddressForPayments', new Date().getTime()-start)

    statsd.increment('LTC_checkAddressForPayments')


      return payments;
}

async function createAddressForward(record: I_Address) {

  let url = "https://api.anypay.global/ltc/address_forward_callbacks";

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: 'https://api.anypay.global/ltc/address_forward_callbacks'

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  let address = await createAddressForward(record);

  return address;

}


const currency = 'LTC';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};
