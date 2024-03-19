
import axios from 'axios'

import { log } from '../log'

import { Price } from './price'

class InvalidPricePair implements Error {
  name = 'KrakenInvalidPricePair'
  message = 'pair is not a valid kraken price pair'

  constructor(pair: string) {
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

    let {data} = await axios.get(`https://api.kraken.com/0/public/Ticker?pair=${pair}`)

    var value: number;

    if (data.result[pair]) {

      value = parseFloat(data.result[`${currency}USD`]['a'][0])

    } else if (data.result[`X${currency}ZUSD`]) {

      value = parseFloat(data.result[`X${currency}ZUSD`]['a'][0])

    } else if (data.result[`X${currency}USD`]) {

      value = parseFloat(data.result[`X${currency}USD`]['a'][0])

    } else {

      throw new Error(`kraken pair ${pair} not supported`)

    }

    if (currency === 'XDG') {
      currency = 'DOGE'
    }

    if (currency === 'XBT') {
      currency = 'BTC'
    }

    return {
      base: 'USD',
      currency,
      value,
      source: 'kraken'
    }

  } catch(error) {

    log.error('kraken.price.pair.invalid', new InvalidPricePair(pair))

    throw error
    
  }
}
