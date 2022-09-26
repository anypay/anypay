
const btc = require('bitcore-lib')

import { Plugin, BroadcastTransactionResult } from '../../lib/plugins'

export { btc as bitcore }

import { oneSuccess } from 'promise-one-success'

import { blockchair, config, chain_so } from '../../lib'

import * as bitcoind_rpc from './bitcoind_rpc'


class AnypayPluginBTC extends Plugin {

  bitcore = btc;

  async broadcastTx({ tx_hex }): Promise<BroadcastTransactionResult> {

    const broadcastProviders: Promise<BroadcastTransactionResult>[] = []

    if (config.get('blockchair_broadcast_provider_btc_enabled')) {
  
      broadcastProviders.push(
  
        blockchair.broadcastTx('bitcoin', tx_hex)
      )
  
    }
  
    if (config.get('chain_so_broadcast_provider_enabled')) {
  
      broadcastProviders.push(
  
        chain_so.broadcastTx('BTC', tx_hex)
      )
  
    }
  
    if (config.get('bitcoind_rpc_host')) {
  
      broadcastProviders.push(
        
        bitcoind_rpc.broadcastTx(tx_hex)
      )
    }
  
    return oneSuccess<BroadcastTransactionResult>(broadcastProviders)

  }

  async getTransaction(txid: string): Promise<string> {

    return blockchair.getTransaction('BTC', txid)
      
  }

  transformAddress({ value: address }) {

    if (address.match(':')) {

      address = address.split(':')[1]

    }

    return address;

  }

  validateAddress(address: string){

    try {

      new btc.Address(address)
    
      return true

    } catch(error) {

      throw new Error('Invalid BTC address. SegWit addresses not supported. Use 1 or 3-style addresses.')

    }

  }
  
}

export default new AnypayPluginBTC('BTC')
