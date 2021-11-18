require('dotenv').config();

const http = require('superagent');

import { setPrice } from './';

export async function getCryptoPrices(base_currency: string) {

  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
     .query({
        start: 1,
        limit: 50,
        convert: base_currency
      })
      .set( 'X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_API_KEY);

  return resp.body.data;

}

export async function updateCryptoUSDPrices() {
 
  const coins = [
    'BSV',
    'BCH',
    'BTC',
    'LTC',
    'DASH',
    'SOL'
  ];

  let prices = await getCryptoPrices('USD');

  return Promise.all(prices.filter(price => {
    return coins.includes(price.symbol);
  })
  .map(price => {
    return {
      currency: price.symbol,
      base_currency: 'USD',
      value: 1 / price['quote']['USD']['price'],
      source: 'coinmarketcap.com'
    }
  })
  .map(async price => {

    if (price.currency === 'BTC') {
      // set BTCLN price to the same as BTC
      await setPrice('BTCLN', price.value, price.source, price.base_currency)
      await setPrice(price.base_currency, 1 / price.value, price.source, 'BTCLN');
    }

    await setPrice(price.currency, price.value, price.source, price.base_currency)
    await setPrice(price.base_currency, 1 / price.value, price.source, price.currency);

  }))

}


