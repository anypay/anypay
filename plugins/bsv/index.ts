require('dotenv').config()

import * as  bchaddr from 'bchaddrjs';

import * as Minercraft from 'minercraft';


export async function broadcastTx(hex) {

  let miners = [
    new Minercraft({
      url: "https://merchantapi.matterpool.io"
    }),
    new Minercraft({
      url: "https://merchantapi.taal.com"
    })
  ]

  return Promise.race(miners.map(miner => {
    return miner.tx.push(hex); 
  }))

}

var toLegacyAddress = bchaddr.toLegacyAddress;
var isCashAddress = bchaddr.isCashAddress;

import * as bsv from 'bsv';

import { rpc } from './lib/jsonrpc';

import {generateInvoice} from '../../lib/invoice';

import {models} from '../../lib/models';

import {statsd} from '../../lib/stats/statsd'

const polynym = require('polynym');

var WAValidator = require('anypay-wallet-address-validator');

export async function submitTransaction(rawTx: string) {

  return rpc.call('sendrawtransaction', [rawTx]);

}

async function createInvoice(accountId: number, amount: number) {

  let start = new Date().getTime()

  let invoice = await generateInvoice(accountId, amount, 'BSV');

  statsd.timing('BSV_createInvoice', new Date().getTime()-start)

  statsd.increment('BSV_createInvoice')

  return invoice;

}

export async function getPaymail(alias: string) {

  try {

    let address = (await polynym.resolveAddress(alias)).address;

    if (address) {

      return address;

    } else {

      return null;
    }
  } catch(error) {

    return null;

  }

}


export async function transformAddress(alias: string){

  try {

    try{
            
      if( isCashAddress(alias) ){
      
        return toLegacyAddress(alias)

      }


    }catch(err){

    }

    if (alias.match(':')) {

      alias = alias.split(':')[1];

    }

    console.log('ALIAS', alias);

    return (await polynym.resolveAddress(alias)).address;

  } catch(error) {
    throw new Error('invalid BSV address');
  }

}


export async function getNewAddress(deprecatedParam){

  return deprecatedParam.value;

  /*
  //Create a new HDKeyAddress 
  let record = await models.Hdkeyaddresses.create({

    currency:'BSV',

    xpub_key:process.env.BSV_HD_PUBLIC_KEY

  })

  record.address = deriveAddress(process.env.BSV_HD_PUBLIC_KEY, record.id)

  await record.save()

  rpc.call('importaddress', [record.address, "", false, false])

  return record.address;
  */

}

function deriveAddress(xkey, nonce){

  let address = new bsv.HDPublicKey(xkey).deriveChild(nonce).publicKey.toAddress().toString()

  return address 

}

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'bitcoin')

  return valid;

}

const name = 'Bitcoin Satoshi Vision';

const currency = 'BSV';

const icon = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Bsv-icon-small.png";

export {

  name,

  currency,

  icon,

  createInvoice

}

