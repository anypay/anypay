
import * as blockchair from '../../lib/blockchair'

import {log} from '../../lib';

const bitcore: any = require('bitcore-lib-cash');

var bchaddr: any = require('bchaddrjs');

import { BroadcastTransactionResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'


import { Plugin } from '../../lib/plugins'

class PluginBCH extends Plugin {

  currency = 'BCH'

  bitcore = bitcore

  async broadcastTx({ tx_hex }): Promise<BroadcastTransactionResult> {

    const broadcastProviders: Promise<BroadcastTransactionResult>[] = [

      blockchair.broadcastTx('bitcoin-cash', tx_hex)
  
    ]
  
    return oneSuccess<BroadcastTransactionResult>(broadcastProviders)
  
  }

  async getTransaction(txid: string) {

    return blockchair.getTransaction('BCH', txid)
  
  }
  
  transformAddress({ value: address }): string {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }

  validateAddress(address: string){

    try {

      new bitcore.HDPublicKey(address);
  
      log.debug('plugins.bch.hdpublickey.valid', address)
  
      return true;
  
    } catch(error) {
  
      log.debug('plugins.bch.hdpublickey.invalid', error)
  
    }
  
    try {
  
      var isCashAddress = bchaddr.isCashAddress
  
      let valid = isCashAddress(address)
  
      return valid;
  
    } catch(error) {
  
      return false;
  
    }
  
  }
  
}

export default new PluginBCH('BCH')
