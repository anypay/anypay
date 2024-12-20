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

require('dotenv').config()

import { expect } from '@/test/utils'

import { convert, setAllFiatPrices } from '@/lib/prices'

import prisma from '@/lib/prisma'

describe('Getting Prices', () => {

  before(async () => {

    await prisma.prices.deleteMany({ where: {} })

  })

  it('should get and set all fiat currencies in cache', async () => {

    await prisma.prices.deleteMany({ where: {} })

    expect(

      convert({ currency: 'USD', value: 100 }, 'EUR')

    ).to.be.eventually.rejected;

    await setAllFiatPrices()

    let conversion = await convert({ currency: 'USD', value: 100 }, 'EUR')

    expect(conversion.value).to.be.greaterThan(0)

    expect(conversion.currency).to.be.equal('EUR')

  })

  it('should throw error when price is not found', async () => {

    expect(

      convert({ currency: 'USD', value: 100 }, 'BCH')

    ).to.be.eventually.rejected;

  })

})
