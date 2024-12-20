
import BitcoreCard, { Bitcore, Utxo } from './_bitcore'

import { bsv } from 'scrypt-ts'

const bitcore: Bitcore = bsv

import axios from 'axios'

export default class BSV_Card extends BitcoreCard {

  chain = 'BSV'

  currency = 'BSV'

  bitcore = bitcore

  async getBalance(): Promise<number> {

    const address = this.getAddress()

    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/balance`)

    return data.confirmed + data.unconfirmed

  }

  async listUnspent(): Promise<Utxo[]> {

    const address = this.getAddress()

    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`)

    return Promise.all(data.map(async (unspent: WhatsonchainUtxo) => {

      const { data: txData } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${unspent.tx_hash}`)

      const transaction: WhatsonchainTransaction = txData

      const scriptPubKey = transaction.vout[unspent.tx_pos]

      return {

        scriptPubKey,

        value: unspent.value,

        txid: unspent.tx_hash,

        vout: unspent.tx_pos

      }

    }))

  }

}

interface WhatsonchainTransaction {
  txid: string;
  hash: string;
  size: number;
  version: number;
  locktime: number;
  vin: any[]; 
  vout: any[]; 
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}

interface WhatsonchainUtxo {
  height: number;
  tx_pos: number;
  tx_hash: string;
  value: number;
}
