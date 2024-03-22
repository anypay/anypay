
import { expect, generateAccount } from '../utils'

import { listPaidInvoices } from '../../lib/invoices'

describe('lib/account', () => {

  it('the default test account should be a Account', async () => {

    const account = await generateAccount()

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it('#listPaidInvoices should list the invoices paid', async () => {

    const account = await generateAccount()

    const paidInvoices = await listPaidInvoices(account)

    expect(paidInvoices).to.be.an('array')

  })

})
 