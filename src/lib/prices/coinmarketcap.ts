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

const http = require('superagent');

import { config } from '@/lib/config';

export async function getPrice(currency: string): Promise<any> {

  if (!config.get('COINMARKETCAP_API_KEY')) {

    console.error('COINMARKETCAP_API_KEY environment variable must be set')

  }

  const query = {
    symbol: currency
  }

  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest')
     .query(query)
     .set( 'X-CMC_PRO_API_KEY', config.get('COINMARKETCAP_API_KEY'));

  const result = resp.body.data[currency][0]

  const value = result.quote['USD'].price

  return {
    base: 'USD',
    currency,
    value,
    source: 'coinmarketcap'
  }

}

