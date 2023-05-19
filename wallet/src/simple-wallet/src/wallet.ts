require('dotenv').config()

import { getRPC } from './rpc'

import config from '../../config'

import BigNumber from 'bignumber.js'

import { getBitcore } from './bitcore'

import { Invoice } from './invoice'

import { Client } from './client'

import * as blockchair from '../../blockchair'

import axios from 'axios'

export class UnsufficientFundsError extends Error {
  currency: string;
  address: string;
  paymentRequest: any;
  balance: number;
  required: number;

  constructor({
    currency,
    address,
    paymentRequest,
    balance,
    required
  }: {
    currency: string,
    address: string,
    paymentRequest: any,
    balance: number,
    required: number})
  {
    super()

    this.currency = currency;
    this.address = address;
    this.balance = balance;
    this.required = required;
    this.paymentRequest = paymentRequest

    this.message = `Insufficient ${currency} Balance of ${balance} in ${address}: ${required} required`
  }

}

var assets = require('require-all')({
  dirname  :  __dirname + '/assets',
  recursive: true,
  filter      :  /(.+)\.ts$/,
  map: (name) => name.toUpperCase()
});

const XMR = require('./assets/xmr')

import { FeeRates, getRecommendedFees } from './mempool.space'
import log from '../../log'
import { convertBalance } from './balance'

export interface Utxo {
  txid: string;
  vout: number;
  value: number;
  scriptPubKey?: string;
}

interface PaymentTx {
  tx_hex: string;
  tx_hash?: string;
  tx_key?: string;
}

export interface Balance {
  asset: string;
  address: string;
  value: number;
  value_usd?: number;
  errors?: Error[];
}

interface LoadCard {
  asset: string;
  privatekey: string;
  address?: string;
}

export class Wallet {
  cards: Card[]

  constructor(params: {
    cards: Card[]
  }) {
    this.cards = params.cards
  }

  static async load(cards: LoadCard[]): Promise<Wallet> {

    return new Wallet({ cards: cards.map(card => new Card(card)) })

  }

  async balances(): Promise<Balance[]> {

    let balances = await Promise.all(this.cards.map(async card => {

      //if (card.asset === 'DOGE') { return }
 
      try {

        let balance = await card.balance()

        return balance

      } catch(error) {

        log.error('balances.error', error)

        return null

      }

    }))

    return balances.filter(balance => balance !== null)

  }


  async payInvoice(invoice_uid: string, asset:string, {transmit}:{transmit: boolean}={transmit:true}): Promise<PaymentTx> {

    log.info(`wallet-bot.simple-wallet.payInvoice`, {
      invoice_uid,
      asset,
      transmit
    })

    return this.payUri(`${config.get('API_BASE')}/i/${invoice_uid}`, asset, { transmit })
  }

  async payUri(uri: string, asset:string, {transmit}:{transmit: boolean}={transmit:true}): Promise<PaymentTx> {

    log.info(`wallet-bot.simple-wallet.payUri`, {
      uri,
      asset,
      transmit
    })

    let client = new Client(uri)

    let paymentRequest = await client.selectPaymentOption({
      chain: asset,
      currency: asset
    })

    var payment;

    var options: any;

    if (asset === 'XMR') {

      options = await XMR.buildPayment(paymentRequest)

      payment = options.tx_blob

    } else {

      payment = await this.buildPayment(paymentRequest, asset)

    }

    if (!transmit) return payment;

    log.info('wallet-bot.simple-wallet.transmitPayment', { paymentRequest, options, payment })

    try {
      
      let result = await client.transmitPayment(paymentRequest, payment, options)

      log.info('simple-wallet.transmitPayment.result', result)

    } catch(error) {

      log.info('simple-wallet.transmitPayment.error', error.response.data)

      throw new Error(error.response.data)

    }

    return payment

  }

  asset(asset: string) {

    return this.cards.filter(card => card.asset === asset)[0]
  }

  async newInvoice(newInvoice: { amount: number, currency: string }): Promise<Invoice> {
    return new Invoice()
  }

  async buildPaymentForUri(uri: string, asset:string) {

    let client = new Client(uri)

    let paymentRequest = await client.selectPaymentOption({
      chain: asset,
      currency: asset
    })

    return this.buildPayment(paymentRequest, asset)

  }

  async buildPayment(paymentRequest, asset) {

    let { instructions } = paymentRequest

    let wallet = this.asset(asset)

    let balance = await wallet.balance()

    if (asset === 'XMR') {

      return XMR.buildPayment(paymentRequest)
      
    }

    await wallet.listUnspent()

    let bitcore = getBitcore(asset)

    let privatekey = new bitcore.PrivateKey(wallet.privatekey)

    var tx, totalInput, totalOutput = 0;

    if (asset === 'LTC') {

      let inputs = wallet.unspent.map((output: any) => {

        return {
          txId: output.txid,
          outputIndex: output.vout,
          address: output.address,
          script: output.redeemScript,
          scriptPubKey: output.scriptPubKey,
          satoshis: output.value
        }
      })

      tx = new bitcore.Transaction()
        .from(inputs)

    } else if (asset === 'DOGE') {

      let inputs = wallet.unspent.map((output: any) => {

        const address = new bitcore.Script(output.scriptPubKey).toAddress().toString()

        return {
          txId: output.txid,
          txid: output.txid,
          outputIndex: output.vout,
          address,
          script: output.script,
          scriptPubKey: output.scriptPubKey,
          satoshis: output.value
        }
      })

      tx = new bitcore.Transaction()
        .from(inputs)

    } else {

      const unspent = await Promise.all(wallet.unspent.map(async utxo => {

        if (utxo.scriptPubKey) {
          return utxo
        }

        const raw_transaction = await blockchair.getRawTx(wallet.asset, utxo.txid)

        return Object.assign(utxo, {
          scriptPubKey: raw_transaction['vout'][utxo.vout].scriptPubKey.hex,
        })
      }))

      try {

        const coins = unspent.map(utxo => {

          const result = {
            txId: utxo.txid,
            outputIndex: utxo.vout,
            satoshis: utxo.value,
            scriptPubKey: utxo.scriptPubKey
          }

          return result
        })

        tx = new bitcore.Transaction()
          .from(coins)

      } catch(error) {

        log.error('buildPayment', error)
      }

    }

    totalInput = wallet.unspent.reduce((sum, input) => {

      let satoshis = new BigNumber(input.value).toNumber()

      return sum.plus(satoshis)

    }, new BigNumber(0)).toNumber()

    for (let output of instructions[0].outputs) {

      let address = bitcore.Address.fromString(output.address)

      let script = bitcore.Script.fromAddress(address)

      tx.addOutput(
        bitcore.Transaction.Output({
          satoshis: output.amount,
          script: script.toHex()
        })
      )

      totalOutput += output.amount

    }

    if (totalInput < totalOutput) {

      log.info('InsufficientFunds', {
        currency: wallet.asset,
        totalInput,
        totalOutput
      })

      throw new Error(`Insufficient ${wallet.asset} funds to pay invoice`)
    }

    tx.change(wallet.address)

    if (asset === 'BTC') {

      const feeRate: FeeRates = config.get('btc_fee_rate') || 'fastestFee'

      let feeRates = await getRecommendedFees()

      const fee = feeRates[feeRate] * tx._estimateSize()

      totalOutput  += fee;  

      tx.fee(fee)

      let change = totalInput - totalOutput

      if (change > 0) {

        const changeAddress = bitcore.Address.fromString(wallet.address)

        tx.addOutput(
          bitcore.Transaction.Output({
            satoshis: change,
            script: bitcore.Script.fromAddress(changeAddress).toHex()
          })
        )
      } else if (change < 0) {

        throw new Error(`Insufficient ${wallet.asset} funds to pay invoice`)
      }
      
    }

    if (totalOutput > totalInput) {

      throw new UnsufficientFundsError({
        currency: wallet.asset,
        address: wallet.address,
        paymentRequest,
        balance: totalInput,
        required: totalOutput
      })

    }

    tx.sign(privatekey)

    return tx.toString('hex')

  }

  async getInvoice(uid: string): Promise<any> {

    let { data } = await axios.get(`${config.get('api_base')}/invoices/${uid}`)

    return data

  }
}

interface RPC {
  listUnspent?(address: string, trace?: string): Promise<Utxo[]>;
  getBalance?(address: any): Promise<number>;
}

export class Card {

  asset: string;
  privatekey: string;
  address: string;
  unspent: Utxo[];

  constructor(params: {
    asset: string,
    privatekey?: string,
    address?: string;
  }) {
    this.unspent = []
    this.asset = params.asset
    this.privatekey = params.privatekey
    this.address = params.address

    let bitcore = getBitcore(this.asset)

    if (bitcore.PrivateKey) {
      this.address = new bitcore.PrivateKey(this.privatekey).toAddress().toString();
    }
    
  }
  
  async getUnspent() {

    const blockchairUnspent = await blockchair.listUnspent(this.asset, this.address)

    this.unspent = blockchairUnspent
  }

  async listUnspent(): Promise<Utxo[]> {

    let rpc: RPC = getRPC(this.asset)

    if (rpc['listUnspent']) {

      this.unspent = await rpc['listUnspent'](this.address)

    } else {

      try {

        this.unspent = await blockchair.listUnspent(this.asset, this.address)


      } catch(error) {

        error.asset = this.asset
        error.address = this.address

        log.error('blockchair.listUnspent.error', error)

      }
      
    }

    return this.unspent

  }

  async balance(): Promise<Balance> {

    const asset = this.asset

    let rpc = getRPC(this.asset)

    var value;

    const errors = []

    if (rpc['getBalance']) {

      value = await rpc['getBalance'](this.address)

    } else {

      try {

        value = await blockchair.getBalance(this.asset, this.address)

      } catch(error) {

        errors.push(error)

        error.asset = this.asset
        error.address = this.address

        log.error('blockchair.getBalance.error', error)

      }
      
    }

    const { amount: value_usd } = await convertBalance({
      currency: this.asset,
      amount: this.asset === 'XMR' ? value : value / 100000000
    }, 'USD')

    try {

      this.unspent = await this.listUnspent()

      if (!value) {

        value = this.unspent.reduce((sum, output) => {

          return sum.plus(output.value)
    
        }, new BigNumber(0)).toNumber()

      }

      if (errors.length > 0 && !value) {

        value = false
      }

      return {
        asset: this.asset,
        value: value,
        value_usd,
        address: this.address,
        errors
      }

    } catch(error) {

      return {
        asset: this.asset,
        value: value,
        value_usd,
        address: this.address,
        errors
      }

    }


  }

}

import { wallet_rpc_url, wallet_rpc_config } from './assets/xmr'

export async function loadWallet(loadCards?: LoadCard[]) {

  let cards: Card[] = []

  if (loadCards) {

    for (let loadCard of loadCards) {

      cards.push(new Card(loadCard))

    }
    
  } else {

    if (process.env.LTC_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'LTC',
        privatekey: process.env.LTC_PRIVATE_KEY
      }))
    }
  
    if (process.env.DOGE_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'DOGE',
        privatekey: process.env.DOGE_PRIVATE_KEY
      }))
    }
  
    if (process.env.DASH_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'DASH',
        privatekey: process.env.DASH_PRIVATE_KEY
      }))
    }
  
    if (process.env.BCH_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'BCH',
        privatekey: process.env.BCH_PRIVATE_KEY
      }))
    }
  
    if (process.env.BTC_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'BTC',
        privatekey: process.env.BTC_PRIVATE_KEY
      }))
    }
  
    if (process.env.BSV_PRIVATE_KEY) {
      cards.push(new Card({
        asset: 'BSV',
        privatekey: process.env.BSV_PRIVATE_KEY
      }))
    }

  }

  /*
  if (wallet_rpc_config) {

    cards.push(new Card({
      asset: 'XMR',
      address: wallet_rpc_config['address'],
      privatekey: wallet_rpc_config['password']
    }))
  }
  */

  if (process.env.XRP_PRIVATE_KEY) {
    cards.push(new Card({
      asset: 'XRP',
      privatekey: process.env.XRP_PRIVATE_KEY
    }))
  }

  return new Wallet({ cards })

}

