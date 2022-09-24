
import { expect, account, newInvoice, payInvoice } from '../utils'

import { buildAccountCsvReport, buildReportCsvFromDates } from '../../lib/csv'

import * as moment from 'moment'

describe('lib/csv', () => {

  it('the default test account should be a Account', async () => {

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it('#buildAccountCsvReport should get the account csv report', async () => {

    let csv = await buildAccountCsvReport(account)

    expect(csv).to.be.a('string')

  })

  it('#buildRecportCsvFromDates should get them', async () => {

    const invoice = await newInvoice()
    
    await payInvoice(invoice)

    await invoice.set('status', 'paid')

    const now = moment()

    const before = now.subtract(15, 'minutes')

    await buildReportCsvFromDates(account.id, before.toDate(), now.toDate())

  })

})
