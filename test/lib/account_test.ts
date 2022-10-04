
import { expect, account } from '../utils'

describe('lib/account', () => {

  it('the default test account should be a Account', async () => {

    expect(account).to.be.not.equal(null)

    expect(account.email).to.be.a('string')

    expect(account.denomination).to.be.a('string')

  })

  it('#listPaidInvoices should list the invoices paid', async () => {

    const paidInvoices = await account.listPaidInvoices()

    expect(paidInvoices).to.be.an('array')

  })

})
 