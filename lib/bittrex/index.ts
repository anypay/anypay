require('dotenv').config()

const CryptoJS = require('crypto-js')

const API_BASE = 'https://api.bittrex.com/v3'

import SHA512 from 'crypto-js/sha512'

import * as http from 'superagent'

export async function createOrder() {

}

export async function listOrders() {

  let timestamp = new Date().getTime()

  let contentHash = CryptoJS.SHA512('').toString(CryptoJS.enc.Hex)

  let uri = `${API_BASE}/orders/open`

  let method = 'GET'

  var preSign = [timestamp, uri, method, contentHash].join('');

  var signature = CryptoJS.HmacSHA512(preSign, process.env.BITTREX_SECRET).toString(CryptoJS.enc.Hex);

  let headers = {
    'Api-Key': process.env.BITTREX_KEY,
    'Api-Timestamp': timestamp,
    'Api-Content-Hash': contentHash,
    'Api-Signature': signature
  }

  console.log('headers', headers)

  return http.post(uri)
    .set(headers)
  
}

export async function marketOrder(quantity: number) {

  let payload = {
    "marketSymbol": "BSV-USD",
    "direction": "sell",
    "type": "market",
    "quantity": quantity,
    "timeInForce": "IMMEDIATE_OR_CANCEL"
  }

  let timestamp = new Date().getTime()

  let contentHash = CryptoJS.SHA512(JSON.stringify(payload)).toString(CryptoJS.enc.Hex)

  let uri = `${API_BASE}/orders`

  let method = 'POST'

  var preSign = [timestamp, uri, method, contentHash].join('');

  var signature = CryptoJS.HmacSHA512(preSign, process.env.BITTREX_SECRET).toString(CryptoJS.enc.Hex);

  let headers = {
    'Api-Key': process.env.BITTREX_KEY,
    'Api-Timestamp': timestamp,
    'Api-Content-Hash': contentHash,
    'Api-Signature': signature
  }

  console.log('headers', headers)
  console.log('payload', payload)

  return http.post(uri)
    .set(headers)
    .send(payload)
  
}

export async function sellAllBSV() {

}

