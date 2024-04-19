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

import { config } from "../config";

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
