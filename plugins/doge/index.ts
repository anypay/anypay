
import { Plugin } from '../../lib/plugins'

import { blockchair } from '../../lib'

import * as doge from 'bitcore-doge-lib'

class PluginDoge extends Plugin {

  currency = 'DOGE'

  bitcore = doge

  async broadcastTx({ tx_hex }) {

    return blockchair.broadcastTx('dogecoin', tx_hex)
  
  }

  async getTransaction(txid: string): Promise<string> {

    return blockchair.getTransaction('LTC', txid)
  }
  
  transformAddress({ value: address }): string {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }

  validateAddress(address: string){

    try {

      new doge.Address(address)
    
      return true

    } catch(error) {

      throw new Error('Invalid DOGE address.')

    }

  }
  
}

export default new PluginDoge('')
