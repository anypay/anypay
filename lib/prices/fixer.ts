/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

require('dotenv').config();

import axios from 'axios'

import { BigNumber } from 'bignumber.js'

import { config } from '../config';

const apiKey = config.get('ANYPAY_FIXER_ACCESS_KEY');

import { SetPrice } from './price'

export async function fetchCurrencies(base='USD'): Promise<SetPrice[]> {

  base = base.toLowerCase();

  const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=${base}`;

  let { data } = await axios.get<{rates: any}>(url);

  const rates = data.rates || {};

  return Object.keys(rates).map((currency) => {

     return {
       base_currency: base.toUpperCase(),
       currency: currency,
       value: new BigNumber(1).dividedBy(rates[currency]).toNumber(),
       source: 'data.fixer.io/api/latest'
     }
  })

}

