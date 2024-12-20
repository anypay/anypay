
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

export default class XMR extends Card {

  currency = 'XMR'

  chain = 'XMR'

  decimals = 8
  
  get provider() {

    return dash

  }

  constructor(params?: DashCardParams) {

    super({ phrase: String(params?.phrase) })

    if (params?.phrase) {

      this.phrase = params!.phrase

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

      const utxos: Utxo[] = await this.listUnspent(String(this.address))

      return utxos.reduce((sum, utxo) => {

          return sum + utxo.value

      }, 0)
  }

  async getPrivateKey(): Promise<any> {

    return this.privateKey

  }

  async buildSignedPayment(paymentOption: PaymentOption): Promise<Transaction> {

    const outputs = paymentOption.instructions[0].outputs

    const unspent = await this.listUnspent(String(this.address))

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

