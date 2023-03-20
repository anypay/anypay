require('dotenv').config()
const btc = require('bitcore-lib')
const bitcoin = require('bitcoinjs-lib')

export { btc as bitcore }

import {
  blockchair,
  config,
  chain_so,
  nownodes
} from '../../lib'

import { BroadcastTxResult } from '../../lib/plugins'

import * as bitcoind_rpc from './bitcoind_rpc'

const promiseAny = require('promise.any');

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = []

  if (config.get('blockchair_broadcast_provider_btc_enabled')) {

    broadcastProviders.push(

      blockchair.publish('bitcoin', rawTx)
    )

  }

  if (config.get('chain_so_broadcast_provider_enabled')) {

    broadcastProviders.push((async () => {

      try {

        console.log('CHAIN SO BTC', { rawTx })
        const result = await chain_so.broadcastTx('BTC', rawTx)

        return result
      } catch(error) {

        console.log('plugin-btc: chain_so broadcast failed, trying next provider')

      }

    })())

  }

  if (config.get('bitcoind_rpc_host')) {

    broadcastProviders.push(

      bitcoind_rpc.broadcastTx(rawTx)
    )
  }


  if (config.get('nownodes_enabled')) {

    broadcastProviders.push(

      nownodes.broadcastTx('BTC', rawTx)
    )
  }

  const result: any = promiseAny(broadcastProviders)

  return result

}

export function transformAddress(address: string) {

  if (address.match(':')) {

    address = address.split(':')[1]

  }

  return address;

}

export function validateAddress(address: string){

  try {
    bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin)

    return true

  } catch(error) {

    throw new Error('Invalid BTC address')

  }

}

export async function getNewAddress(deprecatedParam){

  return deprecatedParam.value;

}

