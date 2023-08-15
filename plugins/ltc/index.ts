
import * as blockchair from '../../lib/blockchair'

const bitcoinJsLib = require('bitcoinjs-lib')

export const currency = 'LTC'

import { BroadcastTx, BroadcastTxResult, Plugin, Confirmation,  Transaction, Payment } from '../../lib/plugin'

import { oneSuccess } from 'promise-one-success'

import { getTransaction } from '../../lib/blockcypher'

import * as moment from 'moment'

const LITECOIN = {
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

export default class LTC extends Plugin {

  currency: string = 'LTC'

  chain: string = 'LTC'

  decimals: number = 8;

  get bitcore() {

    return ltc

  }

  async getPayments(txid: string): Promise<Payment[]> {
    throw new Error() //TODO
  }

  async getConfirmation(txid: string): Promise<Confirmation> {

    const transaction = await getTransaction('LTC', txid)

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

