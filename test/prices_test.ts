
require('dotenv').config()

import { expect } from './utils'

import { convert, setPrice, setAllFiatPrices } from '../lib/prices'

import prisma from '../lib/prisma'

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
