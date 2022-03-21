
import { log } from '../log';

import { models } from '../models';

import * as fixer from './fixer';

export { fixer }

import { BigNumber } from 'bignumber.js'

import * as http from 'superagent';

import { toSatoshis } from '../pay'

import * as bittrex from './bittrex'

export { bittrex }

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

export class PriceNotFoundError implements Error {

  name = "PriceNotFoundError"
  message = "price not found for pair"

  constructor(input, output) {
    this.message = `price not found to convert ${input} to ${output}`
  }
}

async function convert(inputAmount: Amount, outputCurrency: string, precision: number = 2): Promise<Amount> {

  // Normalize input to USD if neither input or output is USD 
  if (inputAmount.currency !== 'USD' && outputCurrency !== 'USD') {

    inputAmount = await convert(inputAmount, 'USD')

  }

  // input currency is the account's denomination 
  // output currency is the payment option currency

  let where = {
    base_currency: outputCurrency,
    currency: inputAmount.currency
  };

  let price = await models.Price.findOne({ where });

  if (price) {

    let targetAmount = new BigNumber(inputAmount.value).times(price.value).dp(MAX_DECIMALS).toNumber();

    return {
      currency: outputCurrency,
      value: targetAmount
    };

  } else {

    let inverse = await models.Price.findOne({ where: {
      base_currency: inputAmount.currency,
      currency: outputCurrency
    }});

    if (!inverse) {

      throw new PriceNotFoundError(inputAmount.currency, outputCurrency)

    }

    let price = new BigNumber(1).dividedBy(inverse.value)

    let targetAmount = price.times(inputAmount.value).dp(MAX_DECIMALS).toNumber()

    return {
      currency: outputCurrency,
      value: targetAmount
    };

  }
};

export async function setPrice(price: Price): Promise<Price> {

  price.value = new BigNumber(price.value).dp(MAX_DECIMALS).toNumber()

  log.debug("price.set", price);

  var [record, isNew] = await models.Price.findOrCreate({

    where: {

      currency: price.currency,

      base_currency: price.base_currency

    },

    defaults: price

  });

  await models.PriceRecord.create(price)

  if (!isNew) {

    record.value = price.value;

    record.source = price.source;

    await record.save();

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

    await setPrice({
      currency,
      value, 
      base_currency: price.base_currency,
      source: 'fixer•coinmarketcap'
    });

    await setPrice({
      base_currency: price.base_currency,
      value: 1 / value,
      source: 'fixer•coinmarketcap',
      currency
    });

  }))

}

export async function updateUSDPrices() {

  let prices: Price[] = await fixer.fetchCurrencies('USD');

  await Promise.all(prices.map(async (price: Price) => {

    let record = await setPrice(price)

  }))

  return Promise.all(prices.map(price => {

    return {
      base_currency: price.currency,
      currency: price.base_currency,
      value: 1 / price.value,
      source: price.source
    }
  })
  .map((price: Price) => {

    return setPrice(price)

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

export async function setAllCryptoPrices() {
 
  const coins = [
    'BSV',
    'BCH',
    'BTC',
    'LTC',
    'DASH',
    'DOGE',
    'ZEC',
    //'XMR',
    //'SOL'
  ];

  let prices: Price[] = await Promise.all(coins.map(bittrex.getPrice))

  return Promise.all(prices.map(setPrice))

}

export async function setAllFiatPrices(): Promise<Price[]> {

  let prices: Price[] = await fixer.fetchCurrencies('USD')

  for (let price of prices) {

    await setPrice(price)

  }

  return prices

}

export {
  convert, createConversion
};

