require('dotenv').config();

import axios from 'axios'

import { BigNumber } from 'bignumber.js'

import { config } from '../config';

const apiKey = config.get('ANYPAY_FIXER_ACCESS_KEY');

import { Price } from './price'

export async function fetchCurrencies(base='USD'): Promise<Price[]> {

  base = base.toLowerCase();

  const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=${base}`;

  let { data } = await axios.get<{rates: any}>(url);

  const rates = data.rates || {};

  return Object.keys(rates).map((currency) => {

     return {
       base: base.toUpperCase(),
       currency: currency,
       value: new BigNumber(1).dividedBy(rates[currency]).toNumber(),
       source: 'data.fixer.io/api/latest'
     }
  })

}

