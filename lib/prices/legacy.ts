import { config } from "../config";

const http = require('superagent');

import axios from 'axios'

const apiKey = config.get('ANYPAY_FIXER_ACCESS_KEY')

const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=usd`

var cache: any;

async function updateCurrencies() {

  let {data} = await axios.get(url);

  cache = data.rates;

  return;
}

var interval: NodeJS.Timeout | null = null;

export function startUpdatingCurrencies() {

  if (!apiKey) {
    throw new Error('ANYPAY_FIXER_ACCESS_KEY is not set');
  }

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(async () => {
    await updateCurrencies();

  }, 1000 * 60 * 60 * 12); // every twelve hours


  updateCurrencies();

} 

export function stopUpdatingCurrencies() {

  if (!apiKey) {
    throw new Error('ANYPAY_FIXER_ACCESS_KEY is not set');
  }

  if (interval) {
    clearInterval(interval);
  }
}


async function getLegacyPrices() {

  if (!apiKey) {
    throw new Error('ANYPAY_FIXER_ACCESS_KEY is not set');
  }

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

export { getLegacyPrices }
