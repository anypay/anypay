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

import Card from './_base'

//@ts-ignore
import * as dash from '@dashevo/dashcore-lib'

import axios from 'axios'

import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import { BigNumber } from 'bignumber.js'

import * as bip39 from 'bip39'

interface DashCardParams {
  phrase: string;
}

export default class DASH extends Card {

  currency = 'DASH'

  chain = 'DASH'

  decimals = 8

  providerURL = 'https://insight.dash.org/insight-api'

  // @ts-ignore
  privateKey: dash.HDPrivateKey;

  get provider() {

    return dash

  }

  constructor(params: DashCardParams) {

    super({ phrase: params.phrase })

    if (params.phrase) {

      this.phrase = params.phrase

      const seed = bip39.mnemonicToSeedSync(this.phrase).toString('hex')

      this.privateKey = dash.HDPrivateKey.fromSeed(seed)

      this.address = this.privateKey.privateKey.toAddress().toString()

    }

  }

  async getAddress(): Promise<string> {

    return this.privateKey.privateKey.toAddress().toString()

  }

  async listUnspent(address: string): Promise<Utxo[]> {

      const response = await axios.get(`${this.providerURL}/addr/${address}/utxo`)

      const utxos: InsightUtxo[] = response.data

      return utxos.map(utxo => {
          return {
              scriptPubKey: utxo.scriptPubKey,
              value: utxo.satoshis,
              txid: utxo.txid,
              vout: utxo.vout
          }
      })

  }

  async getBalance(): Promise<number> {

      const utxos: Utxo[] = await this.listUnspent(this.address? this.address : '')

      return utxos.reduce((sum, utxo) => {

          return sum + utxo.value

      }, 0)
  }

  // @ts-ignore
  async getPrivateKey(): dash.HDPrivateKey {

    return this.privateKey

  }

  async buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction> {

    const outputs = paymentOption.instructions[0].outputs

    const unspent = await this.listUnspent(this.address? this.address : '')

    console.log({ unspent })

    var totalOutput: number = 0;

    const coins = unspent.map(utxo => {

      const result = { 
        txId: utxo.txid,
        outputIndex: utxo.vout,
        satoshis: utxo.value,
        scriptPubKey: utxo.scriptPubKey
      }

      return result
    })

    const tx = new dash.Transaction()
      .from(coins)

    let totalInput = unspent.reduce((sum, input) => {

      let satoshis = new BigNumber(input.value).toNumber()

      return sum.plus(satoshis)

    }, new BigNumber(0)).toNumber()

    for (let output of outputs) {

      let address = dash.Address.fromString(output.address)

      let script = dash.Script.fromAddress(address)

      tx.addOutput(
        dash.Transaction.Output({
          satoshis: output.amount,
          script: script.toHex()
        })
      )

      totalOutput += output.amount

    }

    if (totalInput < totalOutput) {

      console.log('InsufficientFunds', {
        currency: 'DASH',
        totalInput,
        totalOutput
      })

      throw new Error(`Insufficient ${'DASH'} funds to pay invoice`)
    }

    tx.change(this.address)

    return { txhex: '', txid: '' }

  }
      
}


import Utxo from '../utxo'

interface InsightUtxo {
    address: string;
    txid: string;
    vout: number;
    scriptPubKey: string;
    amount: number;
    satoshis: number;
    height: number;
    confirmations: number;
}

