
import { getLegacyPrices } from './legacy';
import { getCryptoPrices } from './crypto';
import { getVESPrice } from './localbitcoins';

import * as database from '../database';

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

  let resp = await database.query('select currency, value, base_currency from prices'); 

  let prices = resp[0].reduce(function(acc, price) {

    let pair = `${price.currency}/${price.base_currency}`;
    
    acc[pair] = parseFloat(price.value);

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

  let pair = `${outputCurrency}/${inputAmount.currency}`

  var rate;

  if (prices[pair]) {

    rate = prices[pair];

  } else {

    rate = prices[`${outputCurrency}/BTC`] / prices[`${inputAmount.currency}/BTC`];

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

