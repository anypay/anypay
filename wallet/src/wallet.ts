
import { MnemonicWallet } from './mnemonic_wallet';

import config from './config';

export async function load(): Promise<Wallet> {

  const mnemonic = config.get('wallet_bot_backup_seed_phrase')

  const mnemonicWallet = new MnemonicWallet(mnemonic)

  const cards = mnemonicWallet.cards.map(wallet => {

    const card: Card = new Card({
      asset: wallet.asset,
      privatekey: wallet.privatekey,
      address: wallet.address
    })

    return card

  })

  return loadWallet(cards)

}

import { getRPC } from './rpc'

import config from '../config'

import BigNumber from 'bignumber.js'

import { getBitcore } from './bitcore'

import { Invoice } from './invoice'

import { Client } from './client'

import * as blockchair from '../blockchair'

import axios from 'axios'

import { InsufficientFundsError } from './insufficient_funds_error'

var assets = require('require-all')({
  dirname  :  __dirname + '/assets',
  recursive: true,
  filter      :  /(.+)\.ts$/,
  map: (name) => name.toUpperCase()
});

const XMR = require('./assets/xmr')

import { FeeRates, getRecommendedFees } from './mempool.space'
import log from '../log'
import { convertBalance } from './balance'

interface PaymentTx {
  tx_hex: string;
  tx_hash?: string;
  tx_key?: string;
}

import { Balance } from './balances'

export { Balance }

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


  async payInvoice({
    uid,
    chain,
    currency,
    transmit
  }{
    uid: string,
    chain:string,
    currency:string,
    transmit?:boolean
  }): Promise<PaymentTx> {

    log.info(`wallet-bot.simple-wallet.payInvoice`, {
      invoice_uid,
      asset,
      transmit
    })

    return this.payUri({ uri: `${config.get('API_BASE')}/i/${uid}`, chain, currenecy }, { transmit })
  }

  async payUri({uri, chain, currency, transmit }:{ uri: string, chain: string, currency: string, transmit?: boolean}): Promise<PaymentTx> {

    if (transmit == undefined) {
      transmit = true
    }

    log.info(`wallet-bot.simple-wallet.payUri`, {
      uri,
      asset,
      transmit
    })

    let client = new Client(uri)

    let paymentRequest = await client.selectPaymentOption({
      chain,
      currency
    })

    var payment;

    var options: any;

    if (asset === 'XMR') {

      // TODO: Remove any coin/chain-specific logic into plugins
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

  asset({chain, currency}: {chain:string, currency: string}) {

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

      throw new InsufficientFundsError({
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

export interface RPC {
  listUnspent?(address: string, trace?: string): Promise<UTXO[]>;
  getBalance?(address: any): Promise<number>;
}

import { Card } from './card'
import { wallet_rpc_url, wallet_rpc_config } from './assets/xmr'

interface LoadWallet {
  
}

export async function loadWallet(loadCards?: LoadCard[]) {

  let cards: Card[] = []

  for (let loadCard of loadCards) {

    cards.push(new Card(loadCard))

  }
  
  return new Wallet({ cards })

}

