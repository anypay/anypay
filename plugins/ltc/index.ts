
import * as blockchair from '../../lib/blockchair'

import { Plugin } from '../../lib/plugins';

const bitcore = require('litecore-lib');


class PluginLTC extends Plugin {

  currency = 'LTC'

  bitcore

  async broadcastTx({ tx_hex }) {

    return blockchair.broadcastTx('litecoin', tx_hex)
  
  }

  async getTransaction(txid: string): Promise<string> {

    return blockchair.getTransaction('LTC', txid)
  }

  validateAddress(address: string){

    try {

      new bitcore.Address(address)
    
      return true

    } catch(error) {

      throw new Error(`Invalid ${this.currency} address.`)

    }

  }
  
}

export default new PluginLTC('LTC')

