
const http = require('superagent');

import { Price } from '../price'

export async function getPrice(currency: string): Promise<Price> {

  if (!process.env.COINMARKETCAP_API_KEY) {

    console.error('COINMARKETCAP_API_KEY environment variable must be set')

  }

  const query = {
    symbol: currency
  }

  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest')
     .query(query)
     .set( 'X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_API_KEY);

  const result = resp.body.data[currency][0]

  const value = result.quote['USD'].price

  return {
    base: 'USD',
    currency,
    value,
    source: 'coinmarketcap'
  }

}

