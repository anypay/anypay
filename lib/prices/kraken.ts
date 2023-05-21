
import * as http from 'superagent'

import { log } from '../log'

import { Price } from '../price'

class InvalidPricePair implements Error {
  name = 'KrakenInvalidPricePair'
  message = 'pair is not a valid kraken price pair'

  constructor(pair) {
    this.message = `${pair} is not a valid kraken price pair`
  }
  
}

export async function getPrice(currency: string): Promise<Price> {

  if (currency === 'DOGE') {
    currency = 'XDG'
  }
  if (currency === 'BTC') {
    currency = 'XBT'
  }

  const pair = `${currency}USD`

  try {

    let {body} = await http.get(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)

    var value: number;

    if (body.result[pair]) {

      value = parseFloat(body.result[`${currency}USD`]['a'][0])

    } else if (body.result[`X${currency}ZUSD`]) {

      value = parseFloat(body.result[`X${currency}ZUSD`]['a'][0])

    } else if (body.result[`X${currency}USD`]) {

      value = parseFloat(body.result[`X${currency}USD`]['a'][0])

    } else {

      throw new Error(`kraken pair ${pair} not supported`)

    }

    return {
      base: 'USD',
      currency,
      value,
      source: 'kraken'
    }

  } catch(error) {

    log.error('kraken.price.pair.invalid', new InvalidPricePair(pair))
    
  }
}
