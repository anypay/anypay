
import Card from './_base'

//@ts-ignore
import * as bsv from 'bsv'

import axios from 'axios'

import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import { BigNumber } from 'bignumber.js'

import * as bip39 from 'bip39'

interface BSVCardParams {
  phrase: string;
}

export default class BSV extends Card {

  currency = 'BSV'

  chain = 'BSV'

  decimals = 8

  providerURL = 'https://api.whatsonchain.com/v1/bsv/main'

  privateKey: bsv.HDPrivateKey;

  get provider() {

    return bsv

  }

  constructor(params?: BSVCardParams) {

    super()

    if (params.phrase) {

      this.phrase = params.phrase

      const seed = bip39.mnemonicToSeedSync(this.phrase).toString('hex')

      this.privateKey = bsv.HDPrivateKey.fromSeed(seed)

      this.address = this.privateKey.privateKey.toAddress().toString()

    }

  }

  async getAddress(): Promise<string> {

    return this.privateKey.privateKey.toAddress().toString()

  }

  async listUnspent(address: string): Promise<Utxo[]> {

    const { data } = await axios.get(`${this.providerURL}/address/${this.address}/unspent}`)

    const utxos: any[] = data

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

    const { data } = await axios.get(`${this.providerURL}/address/${this.address}/balance}`)

    return data.confirmed + data.unconfirmed

  }

  async getPrivateKey(): bsv.HDPrivateKey {

    return this.privateKey

  }

  async buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction> {

    const outputs = paymentOption.instructions[0].outputs

    const unspent = await this.listUnspent(this.address)

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

    const tx = new bsv.Transaction()
      .from(coins)

    let totalInput = unspent.reduce((sum, input) => {

      let satoshis = new BigNumber(input.value).toNumber()

      return sum.plus(satoshis)

    }, new BigNumber(0)).toNumber()

    for (let output of outputs) {

      let address = bsv.Address.fromString(output.address)

      let script = bsv.Script.fromAddress(address)

      tx.addOutput(
        bsv.Transaction.Output({
          satoshis: output.amount,
          script: script.toHex()
        })
      )

      totalOutput += output.amount

    }

    if (totalInput < totalOutput) {

      console.log('InsufficientFunds', {
        currency: 'BSV',
        totalInput,
        totalOutput
      })

      throw new Error(`Insufficient ${'BSV'} funds to pay invoice`)
    }

    tx.change(this.address)

    return { txhex: '', txid: '' }

  }
      
}


import Utxo from '../utxo'

interface WhatsonchainUnspent {
  height: number;
  tx_pos: number;
  tx_hash: string;
  value: number;
}
