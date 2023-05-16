
import { account, expect, newInvoice } from '../utils'

import { cancelInvoice, getInvoice } from '../../lib/invoices'
import { createEmptyInvoice, ensureInvoice, isExpired, refreshInvoice } from '../../lib/invoice'
import { createApp } from '../../lib/apps'

describe('lib/invoices', () => {

  it('should get the account for an invoice', async () => {

    const invoice = await newInvoice()

    expect(invoice.account_id).to.be.a('number')
    expect(invoice.denomination).to.be.a('string')
    expect(invoice.payment).to.be.equal(undefined)
    expect(invoice.refund).to.be.equal(undefined)
    expect(invoice.status).to.be.equal('unpaid')
    expect(invoice.webhook_url).to.be.a('string')

    const invoiceAccount = await invoice.getAccount()

    expect(invoiceAccount.id).to.be.equal(invoice.account_id)

    const invoiceJSON = invoice.toJSON()

    expect(invoiceJSON.uid).to.be.equal(invoice.get('uid'))

  })

  it('#cancelInvoice should cancel an invoice', async () => {

    let invoice = await newInvoice()

    await cancelInvoice(invoice)

    invoice = await getInvoice(invoice.uid)

    expect(invoice.get('status')).to.be.equal('cancelled')

  })

  it('#ensureInvoice should get an invoice', async () => {

    let invoice = await newInvoice()

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.uid).to.be.a('string')

  })

  it('#ensureInvoice should fail for an invoice invoice', async () => {

    expect (

        ensureInvoice('INVALID')
    )
    .to.be.eventually.rejected

  })

  it('#refreshInvoice should update the invoice options',  async () => {

    let invoice = await newInvoice()

    await refreshInvoice(invoice.uid)

  })

  it('#isExpired should determine whether an invoice is expired', async () => {

    let invoice = await newInvoice()

    const expired = await isExpired(invoice)

    expect(expired).to.be.false

  })

  it("#createEmptyInvoice should create an invoice for an app", async () => {

    const app = await createApp({ account_id: account.id, name: '@merchant' })

    const invoice = await createEmptyInvoice(app.id, {
        amount: 52.00,
        currency: 'RUB'
    })

    expect(invoice.status).to.be.equal('unpaid')

  })


  it("#createEmptyInvoice should fail with invalid app id", async () => {

    expect (

        createEmptyInvoice(-1)

    )
    .to.be.eventually.rejected

  })

  it('#getPaymentOptions should get the options for an invoice', async () => {

    let invoice = await newInvoice()

    let options = await invoice.getPaymentOptions()

    expect(options).to.be.an('array')
    
  })

})
 
