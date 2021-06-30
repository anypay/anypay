require('dotenv').config()

const CryptoJS = require('crypto-js')

const API_BASE = 'https://api.bittrex.com/v3'

import SHA512 from 'crypto-js/sha512'

import * as http from 'superagent'

import { models } from '../models'

import { Balance, Order, Address, Deposit } from './types'

export async function setAccountAddresses(account_id: number) {

  let addresses = await listAddresses(account_id)

  for (let address of addresses) {
    let [record] = await models.Address.findOrCreate({
      where: {
        account_id,
        currency: address.currencySymbol
      },
      defaults: {
        account_id,
        currency: address.currencySymbol,
        value: address.cryptoAddress,
        note: 'Bittrex via API'
      }
    })

    console.log(record.toJSON())
  }

}

interface AccountBittrexApiCall {
  account_id: number;
  method: string;
  url: string;
  payload?: any;
}

interface BittrexApiCall {
  api_key: string;
  api_secret: string;
  method: string;
  url: string;
  payload?: any;
  account_id?: number;
}

export async function accountApiCall(params: AccountBittrexApiCall) {

  let { api_key, api_secret } = await models.BittrexAccount.findOne({
    where: { account_id: params.account_id }
  })

  return apiCall(Object.assign(params, {api_key,api_secret}))
}

export async function apiCall(params: BittrexApiCall) {

  let bittrexAccount = await models.BittrexAccount.findOne({
    where: { account_id: params.account_id }
  })

  var payloadString = ''

  if (params.payload) {
    payloadString = JSON.stringify(params.payload)
  }

  let timestamp = new Date().getTime()

  let contentHash = CryptoJS.SHA512(payloadString).toString(CryptoJS.enc.Hex)

  let uri = params.url

  let method = params.method

  var preSign = [timestamp, uri, method, contentHash].join('');

  var signature = CryptoJS.HmacSHA512(preSign, bittrexAccount.api_secret).toString(CryptoJS.enc.Hex);

  let headers = {
    'Api-Key': bittrexAccount.api_key,
    'Api-Timestamp': timestamp,
    'Api-Content-Hash': contentHash,
    'Api-Signature': signature
  }

  if (method === 'POST') {

    try {

      let resp = await http.post(uri)
        .set(headers)
        .send(params.payload)

      return resp.body

    } catch(error) {

      throw new Error(error.response.body.code)

    }

  } else if (method === 'GET') {

    try {

      let resp = await http.get(uri)
        .set(headers)

      return resp.body

    } catch(error) {

      throw new Error(error.response.body.code)

    }

  }

}

export async function createAddress(account_id: number, currency: string) {

  return accountApiCall({
    account_id,
    payload: {
      "currencySymbol": currency
    },
    method: 'POST',
    url: `https://api.bittrex.com/v3/addresses`
  })

}

export async function listAddresses(account_id): Promise<Address[]> {

  return accountApiCall({
    account_id,
    method: 'GET',
    url: 'https://api.bittrex.com/v3/addresses'
  })

}

export async function listOrders(account_id): Promise<Order[]> {

  return accountApiCall({
    account_id,
    method: 'GET',
    url: `${API_BASE}/orders/open`
  })

}

export async function listBalances(account_id): Promise<Balance[]> {

  let balances = await accountApiCall({
    account_id,
    method: 'GET',
    url: 'https://api.bittrex.com/v3/balances'
  })

  return balances.map(balance => {

    balance.available = parseFloat(balance.available)
    balance.total = parseFloat(balance.total)
    return balance

  })

}

export async function getBalance(account_id: number, currency: string): Promise<number> {

  let balance = await accountApiCall({
    account_id,
    method: 'GET',
    url: `https://api.bittrex.com/v3/balances/${currency}`
  })

  return parseFloat(balance.available)

}

export async function marketOrder(account_id: number, currency: string, quantity: number): Promise<Order> {

  return accountApiCall({
    account_id,
    payload: {
      "marketSymbol": `${currency}-USD`,
      "direction": "sell",
      "type": "market",
      "quantity": quantity,
      "timeInForce": "IMMEDIATE_OR_CANCEL"
    },
    url: `${API_BASE}/orders`,
    method: 'POST'
  })

}

export async function listOpenDeposits(account_id: number): Promise<Deposit[]> {

  return accountApiCall({
    account_id,
    url: `https://api.bittrex.com/v3/deposits/open`,
    method: 'GET'
  })

}

export async function getDepositsByTxid(account_id: number, txid: string): Promise<Deposit[]> {

  return accountApiCall({
    account_id,
    url: `https://api.bittrex.com/v3/deposits/ByTxId/${txid}`,
    method: 'GET'
  })

}

export async function sellAllOfCurrency(account_id, currency): Promise<any> {

  let balance = await getBalance(account_id, currency)

  console.log('bittrex.balance', {account_id, balance, currency})

  if (balance > 0) {

    let order = await marketOrder(account_id, currency, balance)

    console.log('bittrex.order', {account_id, order})

    return order

  }

}

