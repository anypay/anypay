
import axios from 'axios'

const  coins = {
  'BSV': 'BCHSV-USDT'
}

import { Price } from './'

export async function getPrice(coin: string): Promise<Price> {

  const tickerSymbol = coins[coin]

  const url = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${tickerSymbol}`

  const { data } = await axios.get(url)

  const price = parseFloat(data.data.price)

  return {
    currency: 'BSV',
    base_currency: 'USD',
    value: price,
    source: 'kucoin.com'
  }

}
