
import axios from 'axios'

import { v4 as uuid } from 'uuid'

import log from './log'

import { Balance } from './balances'

import { UTXO } from './utxo'

import config from './config'

const currencies = {
  'BCH': 'bitcoin-cash',
  'BSV': 'bitcoin-sv',
  'BTC': 'bitcoin',
  'DASH': 'dash',
  'LTC': 'litecoin',
  'DOGE': 'dogecoin'
}

const key = config.get('blockchair_api_key')

export class BlockchairApiError extends Error {}

export async function getAddress(coin: string, address: string) {

  const trace = uuid()

  try {

    log.debug('blockchair.api.dashboards.address', { address, coin, trace })

    const { data } = await axios.get(`https://api.blockchair.com/${coin.toLowerCase()}/dashboards/address/${address}`)

    log.debug('blockchair.api.dashboards.address.result', { trace, data })

    return data

  } catch(err) {

    const error = new BlockchairApiError(err.message)

    log.error('blockchair.api.dashboards', error)

    throw error

  }

}

export async function getBalance(asset: string, address: string): Promise<Balance> {

  try {

    log.info('blockchair.getBalance', { asset, address })

    const currency = currencies[asset]

    const url = `https://api.blockchair.com/${currency}/dashboards/address/${address}?key=${key}`

    const response = await axios.get(url)

    const { data } = response

    log.debug('blockchair.getBalance.result', data)

    const { balance: value } = data['data'][address]['address']

    const utxos = data['data'][address]['utxo']

    return { chain: asset, currency: asset, address, value: parseFloat(value) }

  } catch(err) {

    const error = new BlockchairApiError(err.message)

    log.error('blockchair.api.getBalance.error', error)

    throw error
  }

}

export interface BlockchairUtxo {
  block_id: number;
  transaction_hash: string;
  index: number;
  value: number;
}

export async function listUnspent(asset: string, address: string): Promise<UTXO[]> {

  try {

    log.info('blockchair.listUnspent', { asset, address })

    const currency = currencies[asset]

    const { data } = await axios.get(`https://api.blockchair.com/${currency}/dashboards/address/${address}?key=${key}`)

    log.debug('blockchair.listUnspent.result', data)

    //const utxos: BlockchairUtxo[] = data['data'][address]['utxo']
    const utxos: any[] = data['data'][address]['utxo'] //TODO: Revert any

    console.log('UTXOs', utxos) //TODO: Remove

    /*
    return utxos.map(utxo => {
      return {
        txid: utxo.transaction_hash,
        vout: utxo.index,
        value: utxo.value
      }
    })
    */

    return utxos

  } catch(err) {

    const error = new BlockchairApiError(err.message)

    log.error('blockchair.api.listUnspent.error', error)

    throw error
  }

}

export async function getRawTx(asset: string, txid: string): Promise<any> {

  try {

    const currency = currencies[asset]

    const { data } = await axios.get(`https://api.blockchair.com/${currency}/raw/transaction/${txid}?key=${key}`)

    log.info('blockchair.rawTx.result', { data, asset, txid })

    return data['data'][txid]['decoded_raw_transaction']

  } catch(err) {

    const error = new BlockchairApiError(err.message)

    log.error('blockchair.api.getRawTx.error', error)

    throw error
  }

}

