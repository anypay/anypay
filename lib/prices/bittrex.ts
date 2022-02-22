
import * as http from 'superagent'

import { logInfo } from '../logger'

import { Price } from './'

class InvalidPricePair implements Error {
  name = 'BittrexInvalidPricePair'
  message = 'pair is not a valid bittrex price pair'

  constructor(pair) {
    this.message = `${pair} is not a valid bittrex price pair`
  }
  
}

export async function getPrice(currency: string): Promise<Price> {

  logInfo('bittrex.getprice', { currency })

  const pair = `${currency}-USDT`

  try {

    let {body} = await http.get(`https://api.bittrex.com/v3/markets/${pair}/orderbook`)

    let value = parseFloat(body.bid[0].rate)

    return {
      base_currency: 'USD',
      currency,
      value,
      source: 'bittrex'
    }
  } catch(error) {

    throw new InvalidPricePair(pair)

  }
}
