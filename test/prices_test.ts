
require('dotenv').config()

import { expect } from './utils'

import { bittrex } from '../lib/prices'

import { convert, setPrice, setAllFiatPrices, Price, PriceNotFoundError } from '../lib/prices'

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

  it('should get the current price from bittrex', async () => {

    let price = await bittrex.getPrice('BSV')

    expect(price.base_currency).to.be.equal('USD')
    expect(price.currency).to.be.equal('BSV')
    expect(price.value).to.be.greaterThan(0)

  })

  it('should set a price in the database_currency cache', async () => {

    let price = await bittrex.getPrice('BSV')

    let record = await setPrice(price)

  })

  it('should convert crypto to USD using the cache', async () => {

    let price = await bittrex.getPrice('BSV')

    await setPrice(price)

    let conversion = await convert({ currency: 'BSV', value: 1 }, 'USD')

    expect(conversion.value).to.be.equal(price.value)

    expect(conversion.currency).to.be.equal('USD')

  })

  it('should convert USD to crypto using the cache', async () => {

    let price = await bittrex.getPrice('BSV')

    await setPrice(price)

    let conversion = await convert({ currency: 'USD', value: 100 }, 'BSV')

    expect(conversion.value).to.be.greaterThan(0)

    expect(conversion.currency).to.be.equal('BSV')

  })

  it('should throw error when price is not found', async () => {

    expect(

      convert({ currency: 'USD', value: 100 }, 'BCH')

    ).to.be.eventually.rejectedWith(new PriceNotFoundError('USD', 'BCH'))

  })

  it('should should synthesize crypto to fiat price through USD', async () => {

    await models.Price.destroy({ where: {}})

    let price = await bittrex.getPrice('BCH')

    let USD_BCH_Price = await setPrice(price)

    await setAllFiatPrices()

    var conversion = await convert({ currency: 'EUR', value: 100 }, 'BCH')

    expect(conversion.currency).to.be.equal('BCH')

    expect(conversion.value).to.be.greaterThan(0)

    conversion = await convert({ currency: 'BCH', value: 1 }, 'EUR')

    expect(conversion.currency).to.be.equal('EUR')

    expect(conversion.value).to.be.lessThan(USD_BCH_Price.value)

  })

})
