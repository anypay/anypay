const http = require("superagent");

import {generateInvoice} from '../../lib/invoice';

import {Payment,Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import * as forwards from './lib/forwards';

import * as blockchair from '../../lib/blockchair';

import { I_Address } from '../../types/interfaces';

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DOGE')

  return valid;

}

export async function getNewAddress(record) {
  return record.value;
}

async function generateInvoiceAddress(settlementAddress: string): Promise<string> {

  let start = new Date().getTime()

  let paymentForward = await forwards.setupPaymentForward(settlementAddress);

  return paymentForward.input_address;

}

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

async function createAddressForward(record: I_Address) {

  let url = process.env.DOGE_FORWARDING_URL;

  let callback_url = `${process.env.API_BASE}/DOGE/payments` 

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: callback_url

  });

  return resp.body.input_address;

}

export async function submitTransaction(rawTx: string) {

  return blockchair.publish('dogecoin', rawTx)

}
export async function broadcastTx(rawTx: string) {

  return blockchair.publish('dogecoin', rawTx)

}

const currency = 'DOGE';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};

