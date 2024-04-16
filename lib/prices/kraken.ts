/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import axios from 'axios'

import { log } from '../log'

import { SetPrice as UnsavedPrice} from './price'

class InvalidPricePair implements Error {
  name = 'KrakenInvalidPricePair'
  message = 'pair is not a valid kraken price pair'

  constructor(pair: string) {
    this.message = `${pair} is not a valid kraken price pair`
  }
  
}

export async function getPrice(currency: string): Promise<UnsavedPrice> {

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
      base_currency: 'USD',
      currency,
      value,
      source: 'kraken'
    }

  } catch(error) {

    log.error('kraken.price.pair.invalid', new InvalidPricePair(pair))

    throw error
    
  }
}
