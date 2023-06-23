
import { log } from '../log';

import { models, sequelize } from '../models';

import * as fixer from './fixer';

export { fixer }

import { BigNumber } from 'bignumber.js'

import * as bittrex from './bittrex'

import * as kraken from './kraken'

export { bittrex, kraken }

import { Price } from '../price'

import { Op } from 'sequelize'

import { getPrice } from '../plugins'

const MAX_DECIMALS = 8;

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
    base: outputCurrency,
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
      base: inputAmount.currency,
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

      base: price.base

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

export async function updateUSDPrices() {

  let prices: Price[] = await fixer.fetchCurrencies('USD');

  await Promise.all(prices.map(async (price: Price) => {

    await setPrice(price)

  }))

  return Promise.all(prices.map(price => {

    return {
      base: price.currency,
      currency: price.base,
      value: 1 / price.value,
      source: price.source
    }
  })
  .map((price: Price) => {

    return setPrice(price)

  }));

}

export async function setAllCryptoPrices() {

  const prices: Promise<Price>[] = [];


  prices.push(getPrice({ chain: 'BSV', currency: 'BSV' }))
  prices.push(getPrice({ chain: 'XRP', currency: 'XRP' }))

  prices.push(bittrex.getPrice('USDC'))
  prices.push(bittrex.getPrice('USDT'))
  prices.push(bittrex.getPrice('MATIC'))

  prices.push(kraken.getPrice('XMR'))
  prices.push(kraken.getPrice('DASH'))
  prices.push(kraken.getPrice('BTC'))
  prices.push(kraken.getPrice('BCH'))
  prices.push(kraken.getPrice('ETH'))
  prices.push(kraken.getPrice('SOL'))
  prices.push(kraken.getPrice('AVAX'))
  prices.push(kraken.getPrice('DOGE'))
  prices.push(kraken.getPrice('LTC'))
  prices.push(kraken.getPrice('ZEC'))
  prices.push(kraken.getPrice('XLM'))

  await Promise.all(prices.map(async priceResult => {

    try {

      return setPrice(await priceResult)

    } catch(error) {

      console.error(`error getting price`, error)
    }

  }))

}

export async function setAllFiatPrices(): Promise<Price[]> {

  let prices: Price[] = await fixer.fetchCurrencies('USD')

  for (let price of prices) {

    await setPrice(price)

  }

  return prices

}

export async function listPrices(): Promise<Price[]> {

  const coins = await models.Coin.findAll()

  return models.Price.findAll({
    where: {
      base: 'USD',
      currency: {
        [Op.in]: coins.map(c => c.code)
      }
    },
    order: [['currency', 'asc']]
  })

}

export async function getPriceHistory(currency: string, days: number=30) {
  // hourly average of price records for the past thirty days

  const query = `SELECT date_trunc('hour', "public"."PriceRecords"."createdAt") AS "createdAt", avg("public"."PriceRecords"."value") AS "avg"
  FROM "public"."PriceRecords"
  WHERE ("public"."PriceRecords"."currency" = '${currency}'
     AND "public"."PriceRecords"."createdAt" >= CAST((now() + (INTERVAL '-${days} day')) AS date) AND "public"."PriceRecords"."createdAt" < CAST(now() AS date))
  GROUP BY date_trunc('hour', "public"."PriceRecords"."createdAt")
  ORDER BY date_trunc('hour', "public"."PriceRecords"."createdAt") ASC;`

  const [results] = await sequelize.query(query)

  return results.map(result => {

    return {
      createdAt: result.createdAt,
      avg: parseFloat(result.avg)
    }

  })

}

export {
  convert, createConversion
};

