require('dotenv').config()
const btc = require('bitcore-lib')

import * as moment from 'moment'

export { btc as bitcore }

import {
  blockchair,
  config,
  chain_so,
  nownodes
} from '../../lib'

import { BroadcastTxResult, BroadcastTx, Transaction, Plugin, VerifyPayment, Confirmation } from '../../lib/plugin'

import { log } from '../../lib/log'

import * as bitcoind_rpc from './bitcoind_rpc'

import { oneSuccess } from 'promise-one-success'

import { getTransaction } from '../../lib/blockcypher'

export default class BTC extends Plugin {

  currency: string = 'BTC'

  chain: string = 'BTC'

  decimals: number = 8;

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction(txid)

    if (!transaction) { return }

    if (!transaction.block_hash) { return }

    return {
      height: transaction.block_height,
      hash: transaction.block_hash, 
      timestamp: moment(transaction.confirmed).toDate(),
      depth: transaction.confirmations
    }

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = []

    if (config.get('blockchair_broadcast_provider_btc_enabled')) {

      broadcastProviders.push(

        blockchair.publish('bitcoin', txhex)
      )

    }

    if (config.get('chain_so_broadcast_provider_enabled')) {

      broadcastProviders.push((async () => {

        try {

          const result = await chain_so.broadcastTx('BTC', txhex)

          return result
        } catch(error) {

          console.log('plugin-btc: chain_so broadcast failed, trying next provider')

        }

      })())

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

      new btc.Address(address);

      return true;

    } catch(error) {

      log.debug('plugins.btc.validateAddress.error', error)

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { hex: '' }
  }

  async verifyPayment(params: VerifyPayment): Promise<boolean> {

    return false
  }

}

