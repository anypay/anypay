require('dotenv').config()

import * as  bchaddr from 'bchaddrjs';

import * as bsv from 'bsv';

import { fromSatoshis } from '../../lib/pay'

import * as taal from './lib/taal'

import * as run from './lib/run'

import * as whatsonchain from './lib/whatsonchain'

import { Address } from '../../lib/addresses'

interface Payment {
  amount: number;
  hash: string;
  currency: string;
  address: string;
  invoice_uid?: string;
}

export async function getTransaction(txid: string): Promise<any> {

  let tx_hex = await whatsonchain.getTransaction(txid)

  return new bsv.Transaction(tx_hex)

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


import { BroadcastTxResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'
import { blockchair } from '../../lib';

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    taal.broadcastTransaction(rawTx),

    blockchair.publish('bitcoin-sv', rawTx),

    run.broadcastTx(rawTx)

  ]

  return oneSuccess<BroadcastTxResult>(broadcastProviders)

}


var toLegacyAddress = bchaddr.toLegacyAddress;
var isCashAddress = bchaddr.isCashAddress;

const polynym = require('polynym');

var WAValidator = require('anypay-wallet-address-validator');

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


export async function getNewAddress(address: Address): Promise<string>{

  const paymail = address.get('paymail')

  if (paymail) {

    let resolved = await polynym.resolveAddress(paymail)

    return resolved.address

  } else {

    return address.get('value');

  }

}

export function validateAddress(address: string){

  let valid = WAValidator.validate( address, 'bitcoin')

  return valid;

}

export { bsv as bitcore }
