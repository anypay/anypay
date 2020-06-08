
require('dotenv').config();

import {createWebhook} from './lib/blockcypher';

import {generateInvoice} from '../../lib/invoice';

import * as chainSoAPI from '../../lib/chainSoAPI';

import {Invoice} from '../../types/interfaces';

import {statsd} from '../../lib/stats/statsd'

import {log, xpub, models} from '../../lib'

import { rpc } from './lib/jsonrpc';

import * as Blockcypher from '../../lib/dash/blockcypher';

import { I_Address } from '../../types/interfaces';

import * as http from 'superagent';

import * as address_subscription from '../../lib/address_subscription';

import * as dash from '@dashevo/dashcore-lib';

var WAValidator = require('anypay-wallet-address-validator');

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'DASH')

  return valid;

}

export async function submitTransaction(rawTx: string) {

  return rpc.call('sendrawtransaction', [rawTx]);

}

export async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  log.info('about to generate dash invoice');

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  log.info('generated dash invoice');

  statsd.timing('DASH_createInvoice', new Date().getTime()-start)
  
  statsd.increment('DASH_createInvoice')

  return invoice;

}

async function createAddressForward(record: I_Address) {

  let url = "https://dash.anypay.global/v1/dash/forwards";

  let callbackBase = process.env.API_BASE || 'https://api.anypay.global';

  let resp = await http.post(url).send({

    destination: record.value,

    callback_url: `${callbackBase}/dash/address_forward_callbacks`

  });

  return resp.body.input_address;

}

export async function getNewAddress(record: I_Address) {

  var address;

  /* 
   * Example extended public key:
   *
   * xpub6CwejPWLBbxgg9hhVUA8kT2RL83ARa1kAk3v564a72kPEyu3sX9GtVNn2UgYDu5aX94Xy3V8ZtwrcJ9QiM7ekJHdq5VpLLyMn4Bog9H5aBS
   *
   * (stevenzeiler dash android wallet)
   *
   */

  if (record.value.match(/^xpub/)) {

    address = record.value;

    //address contains metadata 
    /*
    * example xpub key given by DASH official wallet 
    *xpub6CfwhFo3F2UmpqM19kE1P7W3JTZ5ieUBYNcYt8fxpYcvUU1hgMvzuBsZeS2Ujq7zV1XH1m1mDudS43nMBC1oBmM1rvqZ4H3KvGWz7KxaP4f?c=1514577265&h=bip32
    *
    */
    if(address.length == 132){
	address = address.substring(0,111)
    }

    address = xpub.generateAddress('DASH', address, record.nonce);

    await models.Address.update({

      nonce: record.nonce + 1

    },{

      where: {

        id: record.id

      }
    
    });

    let subscription = await address_subscription.createSubscription('DASH', address)

  } else {

    //Create a new HDKeyAddress 
      let record = await models.Hdkeyaddresses.create({

      currency:'DASH',

      xpub_key:process.env.DASH_HD_PUBLIC_KEY

     })

     record.address = deriveAddress(process.env.DASH_HD_PUBLIC_KEY, record.id)

     await record.save()

     try{

       rpc.call('importaddress', [record.address, "", false, false])

     }catch(error){

        console.log(error)
     }
     return record.address;

  }

  return address;

}


function deriveAddress(xkey, nonce){

  let address = new dash.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address 

}




async function checkAddressForPayments(address:string, currency:string){

  log.info(`dash.checkAddressForPayments.${address}`);

  let start = new Date().getTime();

  let payments = await chainSoAPI.checkAddressForPayments(address,currency);

  log.info(`dash.checkAddressForPayments.result`, payments);

  statsd.timing('DASH_checkAddressForPayments', new Date().getTime()-start);

  statsd.increment('DASH_checkAddressForPayments');

  return payments;
}

const currency = 'DASH';

const poll = true;

export {

  currency,

  checkAddressForPayments,

  poll,

  rpc

};
