require('dotenv').config();

import * as http from 'superagent';

import { BigNumber } from 'bignumber.js'

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY;

export interface Price {
  base_currency: string;
  currency: string;
  value: number;
  source: string;
}

export async function fetchCurrencies(base_currency): Promise<Price[]> {

  base_currency = base_currency.toLowerCase();

  const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=${base_currency}`;

  let response = await http.get(url);

  let rates = response.body.rates || {};

  return Object.keys(rates).map((currency) => {

     return {
       base_currency: base_currency.toUpperCase(),
       currency: currency,
       value: new BigNumber(1).dividedBy(rates[currency]).toNumber(),
       source: 'data.fixer.io/api/latest'
     }
  })

}

