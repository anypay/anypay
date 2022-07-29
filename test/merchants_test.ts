
require('dotenv').config()

import { expect } from './utils'

import * as moment from 'moment'

import * as utils from './utils'

import { listActiveSince } from '../lib/merchants'

describe('Getting Prices', () => {

  it('should get active merchants from last week', async () => {

    let merchants = await listActiveSince(1, 'week')

    expect(merchants).to.be.an('array')

  })

  it('should get active merchants from last month', async () => {

    let merchants = await listActiveSince(1, 'month')

    expect(merchants).to.be.an('array')

  })

  it('should get active merchants from last three months', async () => {

    let merchants = await listActiveSince(3, 'months')

    expect(merchants).to.be.an('array')

  })

  it('making a payment should add to the active since', async () => {

    let startCount = (await listActiveSince(3, 'months')).length

    let {account, invoice} = await utils.newAccountWithInvoice()

    await account.set('physical_address', '110 State St, Portsmouth, NH')

    await account.set('business_name', 'Free State Bitcoin Shoppe')

    await invoice.set('status', 'paid')

    let newCount = (await listActiveSince(3, 'months')).length

    expect(newCount).to.be.equal(startCount + 1)

  })

  it('should require the merchant to have a business_name', async () => {

    let startCount = (await listActiveSince(3, 'months')).length

    let {account} = await utils.newAccountWithInvoice()

    await account.set('physical_address', '110 State St, Portsmouth, NH')

    await account.set('business_name', 'Free State Bitcoin Shoppe')

    let newCount = (await listActiveSince(3, 'months')).length

    expect(newCount).to.be.equal(startCount + 1)

  })

  it('should detect merchants active in last week versus last month', async () => {

    let twoWeeksAgo = moment().subtract(2, 'weeks')

    let {account: account1, invoice: invoice1} = await utils.newAccountWithInvoice()

    await account1.set('physical_address', '110 State St, Portsmouth, NH')

    await account1.set('business_name', 'Free State Bitcoin Shoppe')

    let {account: account2, invoice: invoice2} = await utils.newAccountWithInvoice()

    await account2.set('physical_address', '59 Fleet Street, Portsmouth, NH')

    await account2.set('business_name', 'Fresh Press Portsmouth')

    await invoice1.set('status', 'paid')

    await invoice2.set('status', 'paid')

    await invoice2.set('createdAt', twoWeeksAgo)

    let oneMonth = await listActiveSince(1, 'month')

    let oneWeek = await listActiveSince(1, 'week')

    expect(oneMonth.length).to.be.equal(oneWeek.length + 1)

  })

})
