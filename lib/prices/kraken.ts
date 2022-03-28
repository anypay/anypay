
import * as http from 'superagent'

import { log } from '../log'

import { Price } from './'

class InvalidPricePair implements Error {
  name = 'KrakenInvalidPricePair'
  message = 'pair is not a valid kraken price pair'

  constructor(pair) {
    this.message = `${pair} is not a valid kraken price pair`
  }
  
}

const currencies = {
  'XMR': 'XXMRZUSD'
}

export async function getPrice(currency: string): Promise<Price> {

  const pair = `${currency}USD`

  try {

    let {body} = await http.get(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)

    var code = currencies[currency]

    let value = parseFloat(body.result[code]['a'][0])

    return {
      base_currency: 'USD',
      currency,
      value,
      source: 'kraken'
    }

  } catch(error) {

    log.error('kraken.price.pair.invalid', error)

    throw new InvalidPricePair(pair)

  }
}
