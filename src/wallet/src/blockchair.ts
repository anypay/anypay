

import axios from 'axios'

export interface Balance {
  asset: string;
  address: string;
  value: number;
  value_usd?: number;
  errors?: Error[];
}

export interface Currencies  {
  [ticker: string]: string;
}

const currencies: Currencies = {
  'BCH': 'bitcoin-cash',
  'BSV': 'bitcoin-sv',
  'BTC': 'bitcoin',
  'DASH': 'dash',
  'LTC': 'litecoin',
  'DOGE': 'dogecoin'
}

const key = process.env['blockchair_api_key']

export async function getAddress(coin: string, address: string) {

  try {

    const { data } = await axios.get(`https://api.blockchair.com/${coin.toLowerCase()}/dashboards/address/${address}`)

    return data

  } catch(error) {

    console.error('blockchair.api.dashboards', error)

    throw error

  }

}

export async function getBalance(asset: string, address: string): Promise<Balance> {

  try {

    const currency = currencies[asset]

    const url = `https://api.blockchair.com/${currency}/dashboards/address/${address}?key=${key}`

    const response = await axios.get(url)

    const { data } = response

    const { balance: value, balance_usd: value_usd } = data['data'][address]['address']

    return { asset, address, value: parseFloat(value), value_usd: parseFloat(value_usd.toFixed(2)) }

  } catch(err) {

    console.error('blockchair.api.getBalance.error', err)

    throw err
  }

}

export interface BlockchairUtxo {
  block_id: number;
  transaction_hash: string;
  index: number;
  value: number;
}

interface Utxo {
  txid: string;
  vout: number;
  value: number;
}

export async function listUnspent(asset: string, address: string): Promise<Utxo[]> {

  try {

    const currency = currencies[asset]

    const { data } = await axios.get(`https://api.blockchair.com/${currency}/dashboards/address/${address}?key=${key}`)

    const utxos: BlockchairUtxo[] = data['data'][address]['utxo']

    return utxos.map(utxo => {
      return {
        txid: utxo.transaction_hash,
        vout: utxo.index,
        value: utxo.value
      }
    })


  } catch(err) {

    console.error('blockchair.api.listUnspent.error', err)

    throw err
  }

}

export async function getRawTx(asset: string, txid: string): Promise<any> {

  console.log('blockchair.api.getRawTx', { asset, txid })

  try {

    const currency = currencies[asset]

    const { data } = await axios.get(`https://api.blockchair.com/${currency}/raw/transaction/${txid}?key=${key}`)

    return data['data'][txid]['decoded_raw_transaction']

  } catch(error) {

    console.error('blockchair.api.getRawTx.error', error)

    throw error
  }

}

