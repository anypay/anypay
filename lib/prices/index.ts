
import { log } from '../logger';

import { models } from '../models';

import * as fixer from '../../lib/fixer';

import * as http from 'superagent';

import { toSatoshis } from '../pay'

export interface Price {
  base_currency: string;
  currency: string;
  value: number;
  source: string;
}

const MAX_DECIMALS = 5;

interface Amount {
  currency: string;
  value: number;
};

interface Conversion {
  input: Amount;
  output: Amount;
  timestamp: Date
};

async function createConversion(inputAmount: Amount, outputCurrency: string): Promise<Conversion> {
  let input = inputAmount;
  let output = await convert(inputAmount, outputCurrency);
  let timestamp = new Date();

  return {
    input,
    output,
    timestamp
  };
};

async function convert(inputAmount: Amount, outputCurrency: string, precision?: number): Promise<Amount> {

  // input currency is the account's denomination 
  // output currency is the payment option currency

  let where = {
    base_currency: inputAmount.currency,
    currency: outputCurrency
  };

  let price = await models.Price.findOne({ where });

  let targetAmount = inputAmount.value * price.value;

  if (outputCurrency === 'BTCLN') {
    targetAmount = parseInt(toSatoshis(targetAmount).toFixed(0))
  }

  return {
    currency: outputCurrency,
    value: parseFloat(targetAmount.toFixed(precision || MAX_DECIMALS))
  };
};

export async function setPrice(currency:string, value:number, source:string,  base_currency:string) {

  log.info("set price", currency, value, base_currency);

  let [price, isNew] = await models.Price.findOrCreate({

    where: {

      currency,

      base_currency

    },

    defaults: {

      currency,

      value,

      base_currency,
    
      source

    }
  });

  await models.PriceRecord.create({
    currency,
    value,
    base_currency,
    source
  })

  if (!isNew) {

    price.value = value;

    price.source = source;

    await price.save();

  }

  return price;

}

export async function updateCryptoUSDPrice(currency) {

  let BCH_USD_PRICE = await models.Price.findOne({
    where: {
      base_currency: 'USD',
      currency
    }
  });

  let prices = await models.Price.findAll({
    where: {
      currency: 'USD'
    }
  });

  return Promise.all(prices.map(async (price) => {

    if (price.base_currency === currency || price.currency === currency) {
      return
    }

    let value = price.value * BCH_USD_PRICE.value

    await setPrice(currency, value, 'fixer•coinmarketcap', price.base_currency);
    await setPrice(price.base_currency, 1 / value, 'fixer•coinmarketcap', currency);

  }))

}

export async function updateUSDPrices() {

  let prices = await fixer.fetchCurrencies('USD');

  await Promise.all(prices.map(async (price) => {

    let record = await setPrice(price.currency, price.value, price.source, price.base_currency);

  }))

  return Promise.all(prices.map(price => {

    return {
      base_currency: price.currency,
      currency: price.base_currency,
      value: 1 / price.value,
      source: price.source
    }
  })
  .map((price) => {

    return setPrice(price.currency, price.value, price.source, price.base_currency);

  }));

}

const http = require('superagent');

export async function getCryptoPrices(base_currency: string) {

  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
     .query({
        start: 1,
        limit: 5000,
        convert: base_currency
      })
      .set( 'X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_API_KEY);

  await models.CoinMarketCapPrice.bulkCreate(resp.body.data.map(price => {
    price.cmd_id = price.id 
    delete price['id']
    return price
  }))

  return resp.body.data;

}

export async function updateCryptoUSDPrices() {
 
  const coins = [
    'BSV',
    'BCH',
    'BTC',
    'LTC',
    'DASH',
    'DOGE',
    'ZEC',
    'XMR',
    'SOL'
  ];

  let prices = await getCryptoPrices('USD');

  await Promise.all(prices.filter(price => {

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

    await setPrice(price.currency, price.value, price.source, price.base_currency)
    await setPrice(price.base_currency, 1 / price.value, price.source, price.currency);

  }))

  for (let coin of coins) {

    await updateCryptoUSDPrice(coin)

  }

}

export {
  convert, createConversion
};

