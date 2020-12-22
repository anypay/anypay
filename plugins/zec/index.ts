import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {statsd} from '../../lib/stats/statsd'

import {generateInvoice} from '../../lib/invoice';

import { I_Address } from '../../types/interfaces';

import * as blockchair from '../../lib/blockchair';

import * as address_subscription from '../../lib/address_subscription';

import { rpc } from './lib/jsonrpc';

export async function getNewAddress(record) {
  return record.value;
}

export async function validateAddress(address: string){

  let value = await rpc.call('validateaddress', [address])

  if( value.result.isvalid ){

    return true;
  
  }else{

    let z_value= await rpc.call('z_validateaddress', [address]);

    return z_value.result.isvalid

  }


}

export async function submitTransaction(rawTx: string) {

  return blockchair.publish('zcash', rawTx)

}


async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  statsd.timing('ZEC_createInvoice', new Date().getTime()-start)

  statsd.increment('ZEC_createInvoice')

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

    statsd.timing('ZEC_checkAddressForPayments', new Date().getTime()-start)

    statsd.increment('ZEC_checkAddressForPayments')
    
    return payments 
}

async function createAddressForward(record: I_Address) {

  let url = process.env.ZEC_FORWARDING_URL;

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: 'https://api.anypayinc.com/zec/address_forward_callbacks'

  });

  return resp.body.input_address;

}

const currency = 'ZEC';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};


 
