/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config()
const btc = require('bitcore-lib')

const bitcoinJsLib = require('bitcoinjs-lib')

import {
  blockchair,
  config,
  chain_so,
  nownodes
} from '@/lib'

import { BroadcastTxResult, BroadcastTx, Transaction, Payment } from '@/lib/plugin'

import * as bitcoind_rpc from '@/plugins/btc/bitcoind_rpc'

import oneSuccess from 'promise-one-success'

import UTXO_Plugin from '@/lib/plugins/utxo'

export default class BTC extends UTXO_Plugin {

  currency = 'BTC'

  chain = 'BTC'

  decimals = 8;

  providerURL = String(config.get('GETBLOCK_BTC_URL'))

  get bitcore() {

    return btc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = []

    if (config.get('BLOCKCHAIR_BROADCAST_PROVIDER_BTC_ENABLED')) {

      broadcastProviders.push(

        blockchair.publish('bitcoin', txhex)
      )

    }

    if (config.get('CHAIN_SO_BROADCAST_PROVIDER_ENABLED')) {

      broadcastProviders.push(chain_so.broadcastTx('BTC', txhex))

    }

    if (config.get('BITCOIND_RPC_HOST')) {

      broadcastProviders.push(

        bitcoind_rpc.broadcastTx(txhex)
      )
    }

    if (config.get('NOWNODES_ENABLED')) {

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

