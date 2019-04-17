import {Payment,Invoice} from '../../types/interfaces';

const http = require("superagent");

import {statsd} from '../../lib/stats/statsd'

import {generateInvoice} from '../../lib/invoice';

import { I_Address } from '../../types/interfaces';

import { rpc } from './lib/jsonrpc';

export async function validateAddress(address: string){

  let value = await rpc.call('validateaddress', [address])

  console.log(value)
  if( value.result.address === address ){

    return true;

  }else{

    return false;

  }

}


async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'SMART');

  return invoice;

}

async function checkAddressForPayments(address:string,currency:string){

  let payments =[]

 try{

    let resp = await http.get('https://insight.smartcash.cc/api/addr/'+address)

    let transactions = JSON.parse(resp.req.res.text).transactions

    for(let i = 0; i<3;i++){
     
    if( i > transactions.legth-1 ){break}

     let tx = await http.get('https://insight.smartcash.cc/api/tx/'+transactions[i])
    
     tx = JSON.parse(tx.req.res.text)

      for( let j=0; j<tx.vout.length;j++){

	if( typeof(tx.vout[j].scriptPubKey.addresses) == 'undefined'){continue}

        if( tx.vout[j].scriptPubKey.addresses[0] != address){continue}

	let p = {
  
          hash: tx.txid,
  
          amount: tx.vout[j].value,
 
          address: tx.vout[j].scriptPubKey.addresses[0],
  
          currency: 'SMART'
 
	  }

	  payments.push(p)
    
      }

    }

  }

  catch(err){console.log(err)}

  return payments


}

async function createAddressForward(record: I_Address) {

  let url = process.env.SMART_FORWARDING_URL;

  console.log(url)

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: 'https://api.anypay.global/smart/address_forward_callbacks'

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  let address = await createAddressForward(record);

  return address;

}

const currency = 'SMART';

const poll = false;

export {

  currency,

  createInvoice,

  checkAddressForPayments,

  poll

};


 
