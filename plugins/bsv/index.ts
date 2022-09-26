
import * as bitcore from 'bsv';

import { fromSatoshis } from '../../lib/pay'

import * as taal from './lib/taal'

import * as run from './lib/run'

import * as whatsonchain from './lib/whatsonchain'

interface Payment {
  amount: number;
  hash: string;
  currency: string;
  address: string;
  invoice_uid?: string;
}

export function transformHexToPayments(hex: string): Payment[] {

  let tx = new bitcore.Transaction(hex)

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
      
    } else {

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


import { BroadcastTransactionResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'
import { blockchair } from '../../lib';


const polynym = require('polynym');

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

import { Plugin } from '../../lib/plugins'

class PluginBSV extends Plugin {

  currency = 'BSV'

  bitcore = bitcore

  async broadcastTx({ tx_hex }) {

    const broadcastProviders: Promise<BroadcastTransactionResult>[] = [

      taal.broadcastTransaction(tx_hex),
  
      blockchair.broadcastTx('bitcoin-sv', tx_hex),
  
      run.broadcastTx(tx_hex)
  
    ]
  
    return oneSuccess<BroadcastTransactionResult>(broadcastProviders)
  
  
  }
  async getTransaction(txid: string): Promise<any> {

    let tx_hex = await whatsonchain.getTransaction(txid)
  
    return new bitcore.Transaction(tx_hex)
  
  }
  
  transformAddress({ value: address }): string {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }

  validateAddress(address: string){

    try {

      new bitcore.Address(address)
    
      return true

    } catch(error) {

      throw new Error('Invalid PluginBSV address.')

    }

  }
  
}

export default new PluginBSV('BSV')
