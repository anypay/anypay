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

import * as fixer from './fixer';

export { fixer }

import { BigNumber } from 'bignumber.js'

import * as kraken from './kraken'

export { kraken }

import { SetPrice } from './price'

import { getPrice } from '../plugins'

import { prices as Price } from '@prisma/client'

import prisma from '../prisma';

import { Prisma } from '@prisma/client'

import { coins as Coin } from '@prisma/client'

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

  let price = await prisma.prices.findFirst({ where })

  if (price) {

    let targetAmount = new BigNumber(inputAmount.value).times(price.value.toNumber()).dp(MAX_DECIMALS).toNumber();

    return {
      currency: outputCurrency,
      value: targetAmount
    };

  } else {

    let inverse = await prisma.prices.findFirst({
      where: {
        base_currency: inputAmount.currency,
        currency: outputCurrency
      }
    })

    if (!inverse) {

      throw new Error(`no price for ${inputAmount.currency} to ${outputCurrency}`)

    }

    let price = new BigNumber(1).dividedBy(inverse.value.toNumber())

    let targetAmount = price.times(inputAmount.value).dp(MAX_DECIMALS).toNumber()

    return {
      currency: outputCurrency,
      value: targetAmount
    };

  }
};


export async function setPrice(price: SetPrice): Promise<Price> {

  price.value = new BigNumber(price.value).dp(MAX_DECIMALS).toNumber()

  var isNew = false;

  var record = await prisma.prices.findFirst({
    where: {
      currency: price.currency,
      base_currency: price.base_currency
    }
  })

  if (!record) {

    isNew = true
    record = await prisma.prices.create({
      data: {
        currency: price.currency,
        base_currency: price.base_currency,
        value: price.value,
        source: price.source,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    
    })
  }

  await prisma.priceRecords.create({
    data: {
      currency: price.currency,
      base_currency: price.base_currency,
      value: price.value,
      source: price.source,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  if (!isNew) {

    await prisma.prices.update({
      where: {
        id: record.id
      },
      data: {
        value: price.value,
        source: price.source,
        updatedAt: new Date()
      }
    })

  }

  return record;

}

export async function updateUSDPrices() {

  let prices: SetPrice[] = await fixer.fetchCurrencies('USD');

  await Promise.all(prices.map(async (price: SetPrice) => {

    return setPrice({
      base_currency: price.currency,
      currency: 'USD',
      value: price.value,
      source: String(price.source)
    })

  }))

  return Promise.all(prices.map(price => {

    return {
      base_currency: price.currency,
      currency: price.base_currency,
      value: 1 / price.value,
      source: String(price.source)
    }
  })
  .map((price: SetPrice) => {

    setPrice({
      base_currency: price.currency,
      currency: 'USD',
      value: price.value,
      source: String(price.source)
    })

  }));

}

export async function setAllCryptoPrices() {

  const prices: Promise<SetPrice>[] = [];


  prices.push(getPrice({ chain: 'BSV', currency: 'BSV' }))
  prices.push(getPrice({ chain: 'XRP', currency: 'XRP' }))

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

      const result = await priceResult

      return setPrice({
        base_currency: 'USD',
        currency: result.currency,
        value: Number(result.value),
        source: String(result.source)  
      })

    } catch(error) {

      console.error(`error getting price`, error)
    }

  }))

  // TODO: Fetch USDC price from exchange
  await setPrice({
    base_currency: 'USD',
    currency: 'USDC',
    value: 1,
    source: 'hardcoded'  
  })

  // TODO: Fetch USDT price from exchange
  await setPrice({
    base_currency: 'USD',
    currency: 'USDT',
    value: 1,
    source: 'hardcoded'  
  })

}

export async function setAllFiatPrices(): Promise<Price[]> {

  let newPrices: SetPrice[] = await fixer.fetchCurrencies('USD')

  const prices: Price[] = []

  for (let price of newPrices) {

    prices.push(await setPrice(price))

  }

  return prices

}

export async function listPrices(): Promise<Price[]> {

  const coins = await prisma.coins.findMany()

  return prisma.prices.findMany({
    where: {
      base_currency: 'USD',
      currency: {
        in: coins.map((c: Coin) => c.code),
      },
    },
    orderBy: {
      currency: 'asc',
    },
  });

}

export async function getPriceHistory(currency: string, days: number = 30) {
  // Calculate the start date based on the number of days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const query = `
    SELECT date_trunc('hour', "createdAt") AS "createdAt", avg("value") AS "avg"
    FROM "public"."PriceRecords"
    WHERE ("${currency}" = $1
      AND "createdAt" >= CAST((now() + (INTERVAL '-${days} day')) AS date) AND "createdAt" < CAST(now() AS date))
    GROUP BY date_trunc('hour', "createdAt")
    ORDER BY date_trunc('hour', "createdAt") ASC;
  `;

  const results: any = await prisma.$queryRaw(Prisma.sql([query]))

  return results.map((result: { createdAt: any; avg: string }) => ({
    createdAt: result.createdAt,
    avg: parseFloat(result.avg),
  }));
}


export {
  convert, createConversion
};

