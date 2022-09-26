
require('dotenv').config();

import { fromSatoshis, Payment } from '../../lib/pay'

import { blockchair, blockcypher } from '../../lib'

import { oneSuccess } from 'promise-one-success'

import * as dash from '@dashevo/dashcore-lib';

export { dash as bitcore }

import * as insight from './lib/insight'

var WAValidator = require('anypay-wallet-address-validator');

import { Plugin, BroadcastTransactionResult } from '../../lib/plugins'

class AnypayPluginDASH extends Plugin {

  bitcore = dash;

  currency = 'DASH'

  async broadcastTx({ tx_hex }): Promise<BroadcastTransactionResult> {

    const broadcastProviders: Promise<BroadcastTransactionResult>[] = [

      blockchair.broadcastTx('dash', tx_hex),
  
      blockcypher.publish('dash', tx_hex),
  
      insight.broadcastTx(tx_hex)
  
    ]
  
    return oneSuccess<BroadcastTransactionResult>(broadcastProviders)
  
  }

  async getTransaction(txid: string): Promise<string> {

    return blockchair.getTransaction('DASH', txid)
  }
  
  
  transformHexToPayments(hex: string): Payment[] {
  
    let tx = new dash.Transaction(hex)
  
    return tx.outputs.map((output)=>{
  
            return {
              currency: 'DASH',
              hash: tx.hash.toString(),
              amount: fromSatoshis(output.satoshis),
              address: output.script.toAddress().toString()
            }
    })
  
  }
  
  validateAddress(address: string): boolean {
  
    let valid = WAValidator.validate( address, 'DASH')
  
    return valid
  
  }
  
  transformAddress({ value: address }): string {
  
    if (address.match(':')) {
  
      address = address.split(':')[1]
  
    }
  
    return address;
  
  }

}

export default new AnypayPluginDASH('DASH');
