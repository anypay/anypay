
import Card from './_base'

//@ts-ignore
import * as bch from 'bitcore-lib-cash';

import axios from 'axios'

import Transaction from '../transaction'

import PaymentOption from '../payment_option'

import { BigNumber } from 'bignumber.js'

import * as bip39 from 'bip39'

interface DashCardParams {
  phrase: string;
}

export default class BCH extends Card {

  currency = 'BCH'

  chain = 'BCH'

  decimals = 8

  providerURL = 'https://api.bitcore.io/api'

  privateKey: bch.HDPrivateKey;

  get provider() {

    return bch

  }

  constructor(params?: DashCardParams) {

    super()

    if (params.phrase) {

      this.phrase = params.phrase

      const seed = bip39.mnemonicToSeedSync(this.phrase).toString('hex')

      this.privateKey = bch.HDPrivateKey.fromSeed(seed)

      this.address = this.privateKey.privateKey.toAddress().toString()

    }

  }

  async getAddress(): Promise<string> {

    return this.privateKey.privateKey.toAddress().toString()

  }

  async listUnspent(address: string): Promise<Utxo[]> {

      try {

          if (address.match(/:/)) {
              address = address.split(':')[1]
          }

          const url = `${this.providerURL}/BCH/mainnet/address/${address}/?unspent=true`

          const response = await axios.get(url)

          const { data } = response

          const utxos: BitcoreIoUtxo[] = data

          return utxos.map(utxo => {
              return {
                  scriptPubKey: utxo.script,
                  value: utxo.value,
                  txid: utxo.mintTxid,
                  vout: utxo.mintIndex
              }
          })

      } catch(error) {

          console.error('bch.listUnspent.error', error)
          
          throw error

      }

  }

  async getBalance(): Promise<number> {

      const utxos: Utxo[] = await this.listUnspent(this.address)

      return utxos.reduce((sum, utxo) => {

          return sum + utxo.value

      }, 0)
  }

  async getPrivateKey(): bch.HDPrivateKey {

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

    const tx = new bch.Transaction()
      .from(coins)

    let totalInput = unspent.reduce((sum, input) => {

      let satoshis = new BigNumber(input.value).toNumber()

      return sum.plus(satoshis)

    }, new BigNumber(0)).toNumber()

    for (let output of outputs) {

      let address = bch.Address.fromString(output.address)

      let script = bch.Script.fromAddress(address)

      tx.addOutput(
        bch.Transaction.Output({
          satoshis: output.amount,
          script: script.toHex()
        })
      )

      totalOutput += output.amount

    }

    if (totalInput < totalOutput) {

      console.log('InsufficientFunds', {
        currency: 'BCH',
        totalInput,
        totalOutput
      })

      throw new Error(`Insufficient ${'BCH'} funds to pay invoice`)
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

interface BitcoreIoUtxo {
    _id: string;
    chain: string;
    network: string;
    coinbase: boolean;
    mintIndex: number;
    spentTxid: string;
    mintTxid: string;
    mintHeight: number;
    spentHeight: number;
    address: string;
    script: string;
    value: number;
    confirmations: number;
}

