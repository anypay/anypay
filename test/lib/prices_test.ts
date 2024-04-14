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

import { prices } from '../../lib';
import { assert } from '../utils'

describe('Prices', () => {

  it('#setPrice should set a price in the database', async () => {

    await prices.setPrice({
      base_currency: 'USD',
      value: 0.0001,
      source: 'testsource',
      currency: 'BTC'
    });

  });


  it("#convert should convert from USD to XRP", async () => {

    await prices.setPrice({
      base_currency: 'USD',
      value: 0.3,
      source: 'testsource',
      currency: 'XRP'
    })

    let input = {
      currency: 'USD',
      value: 12
    }

    let output = await prices.convert(input, 'XRP');

    assert(output.value > 0);

  });
  
});

