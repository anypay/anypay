require('dotenv').config()

import * as  bchaddr from 'bchaddrjs';

import * as Minercraft from 'minercraft';

import { log } from '../../lib/log'

import { fromSatoshis } from '../../lib/pay'

import * as Bluebird from 'bluebird'

interface Payment{
  amount: number;
  hash: string;
  currency: string;
  address: string;
  invoice_uid?: string;
}

export function transformHexToPayments(hex: string): Payment[]{

  let tx = new bsv.Transaction(hex)

  let payments = [];

  for( let i = 0; i < tx.outputs.length; i++){

    let address = tx.outputs[i].script.toAddress().toString();

    let paymentIndex = payments.findIndex((elem) =>{ return elem.address === address})

    if( paymentIndex > -1 ){

      payments[paymentIndex] = {

        currency: 'BSV',
        hash: tx.hash.toString(),
        amount: fromSatoshis(tx.outputs[i].satoshis) + payments[paymentIndex].amount,
        address: tx.outputs[i].script.toAddress().toString()

      }
      
    }else{

      payments.push({

        currency: 'BSV',
        hash: tx.hash.toString(),
        amount: fromSatoshis(tx.outputs[i].satoshis),
        address: tx.outputs[i].script.toAddress().toString()

      })
      
    }

  }

  return payments

}


export async function broadcastTx(hex) {

  let miners = [
    new Minercraft({
      url: "https://merchantapi.matterpool.io"
    }),
    new Minercraft({
      url: "https://merchantapi.taal.com"
    })
  ]

  return Bluebird.any(miners.map(async miner => {

    let result = await  miner.tx.push(hex); 

    log.info(`miner.tx.push.result`, {
      result,
      hex
    })

    if (result.returnResult === 'success') {

      return result

    } else if (result.resultDescription.match('Transaction already in the mempool')) {

      return result

    } else {

      throw new Error(result.resultDescription)

    }

  }))

}

var toLegacyAddress = bchaddr.toLegacyAddress;
var isCashAddress = bchaddr.isCashAddress;

import * as bsv from 'bsv';

import { rpc } from './lib/jsonrpc';

import {generateInvoice} from '../../lib/invoice';

import {models} from '../../lib/models';

const polynym = require('polynym');

var WAValidator = require('anypay-wallet-address-validator');

export async function submitTransaction(rawTx: string) {

  return rpc.call('sendrawtransaction', [rawTx]);

}

async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'BSV');

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

    alias = alias.split('?')[0];

    return (await polynym.resolveAddress(alias)).address;

  } catch(error) {
    throw new Error('invalid BSV address');
  }

}


export async function getNewAddress(params){

  if (params.paymail && params.paymail.match('handcash.io')) {

    let resolved = await polynym.resolveAddress(params.paymail)

    return resolved.address

  } else {

    return params.value;

  }

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

