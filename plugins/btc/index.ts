require('dotenv').config()
const btc = require('bitcore-lib')

const bitcoinJsLib = require('bitcoinjs-lib')

import {
  blockchair,
  config,
  chain_so,
  nownodes
} from '../../lib'

import { BroadcastTxResult, BroadcastTx, Transaction, Payment } from '../../lib/plugin'

import * as bitcoind_rpc from './bitcoind_rpc'

import oneSuccess from 'promise-one-success'

import UTXO_Plugin from '../../lib/plugins/utxo'

export default class BTC extends UTXO_Plugin {

  currency = 'BTC'

  chain = 'BTC'

  decimals = 8;

  providerURL = String(process.env.getblock_btc_url)

  get bitcore() {

    return btc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = []

    if (config.get('blockchair_broadcast_provider_btc_enabled')) {

      broadcastProviders.push(

        blockchair.publish('bitcoin', txhex)
      )

    }

    if (config.get('chain_so_broadcast_provider_enabled')) {

      broadcastProviders.push(chain_so.broadcastTx('BTC', txhex))

    }

    if (config.get('bitcoind_rpc_host')) {

      broadcastProviders.push(

        bitcoind_rpc.broadcastTx(txhex)
      )
    }

    if (config.get('nownodes_enabled')) {

      broadcastProviders.push(

        nownodes.broadcastTx('BTC', txhex)
      )
    }

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      bitcoinJsLib.address.toOutputScript(address, bitcoinJsLib.networks.bitcoin)

      return true

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { txhex: '' } //TODO
  }


}

