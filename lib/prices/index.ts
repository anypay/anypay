
import { getLegacyPrices } from './legacy';
import { getCryptoPrices } from './crypto';
import { getVESPrice } from './localbitcoins';

import * as database from '../database';

import { log } from '../logger';

import { Price } from '../models';

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

async function getAllPrices() {

  let prices = await Price.findAll();

  prices = prices.reduce(function(acc, price) {

    let pair = `${price.currency}/${price.base_currency}`;

    if (acc[pair]) {

      if (price.createdAt > acc[pair].createdAt) {

        acc[pair] = parseFloat(price.value);

      }

    } else {

      acc[pair] = parseFloat(price.value);

    }

    return acc;

  }, {});

  return prices;
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

async function convert(inputAmount: Amount, outputCurrency: string): Promise<Amount> {

  let prices = await getAllPrices();

  let pair = `${inputAmount.currency}/${outputCurrency}`;

  var rate;

  if (prices[pair]) {

    log.info(`found direct price pair ${pair} ${prices[pair]}`);
    rate = 1 / prices[pair];

  } else {

    rate = prices[`${outputCurrency}/BTC`] / prices[`${inputAmount.currency}/BTC`];
    log.info(`using BTC to convert prices ${outputCurrency} / ${inputAmount.currency} : ${rate}`);

  }


  let targetAmount = inputAmount.value * rate;

  return {
    currency: outputCurrency,
    value: parseFloat(targetAmount.toFixed(MAX_DECIMALS))
  };
};

export {
  convert, createConversion,
  getAllPrices
};

