
import * as blockchair from '../../lib/blockchair';

const doge = require('bitcore-doge-lib');

import { BroadcastTxResult, BroadcastTx, Transaction } from '../../lib/plugin'

import oneSuccess from 'promise-one-success'

import UTXO_Plugin from '../../lib/plugins/utxo'

import axios from 'axios'
import { config } from '../../lib';

export default class DOGE extends UTXO_Plugin {

  currency = 'DOGE'

  chain = 'DOGE'

  decimals = 8;

  providerURL = String(config.get('GETBLOCK_DOGE_URL'))

  get bitcore() {
    return doge
  }

  async getBlock(hash: string) {

    const { data } = await axios.post(this.providerURL, {
      method: 'getblock',
      params: [hash, true]
    })

    return data.result

  }

  async broadcastTx({ txhex }: BroadcastTx): Promise<BroadcastTxResult> {

    const broadcastProviders: Promise<BroadcastTxResult>[] = [

      blockchair.publish('dogecoin', txhex)

    ]

    return oneSuccess<BroadcastTxResult>(broadcastProviders)

  }

  async validateAddress(address: string) {

    try {

      new doge.Address(address);

      return true;

    } catch(error) {

      return false

    }

  }

  async getTransaction(txid: string): Promise<Transaction> {

    return { txhex: '' } //TODO
  }

}

