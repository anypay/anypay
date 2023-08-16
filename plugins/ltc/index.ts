
import * as blockchair from '../../lib/blockchair'

const bitcoinJsLib = require('bitcoinjs-lib')

export const currency = 'LTC'

import { BroadcastTx, BroadcastTxResult,  Transaction, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import UTXO_Plugin from '../../lib/plugins/utxo'

export default class LTC extends UTXO_Plugin {

  currency = 'LTC'

  chain = 'LTC'

  networkInfo = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  };


  decimals = 8

  providerURL = process.env.getblock_ltc_url

  get bitcore() {

    return ltc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('litecoin', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      bitcoinJsLib.address.toOutputScript(address, LITECOIN)

      return true

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { txhex: '' } //TODO
  }

}


