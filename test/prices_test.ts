
require('dotenv').config()

import { expect } from './utils'

import { convert, setPrice, setAllFiatPrices, PriceNotFoundError } from '../lib/prices'

import { models } from '../lib/models'

describe('Getting Prices', () => {

  before(async () => {

    await models.Price.destroy({ where: {}})

  })

  it('should get and set all fiat currencies in cache', async () => {

    await models.Price.destroy({ where: {}})

    expect(

      convert({ currency: 'USD', value: 100 }, 'EUR')

    ).to.be.eventually.rejectedWith(new PriceNotFoundError('USD', 'EUR'))

    await setAllFiatPrices()

    let conversion = await convert({ currency: 'USD', value: 100 }, 'EUR')

    expect(conversion.value).to.be.greaterThan(0)

    expect(conversion.currency).to.be.equal('EUR')

  })

  it('should throw error when price is not found', async () => {

    expect(

      convert({ currency: 'USD', value: 100 }, 'BCH')

    ).to.be.eventually.rejectedWith(new PriceNotFoundError('USD', 'BCH'))

  })

})
