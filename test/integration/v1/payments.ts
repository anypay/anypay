import * as utils from '../../utils'

import { expect } from '../../utils'

import { recordPayment } from '../../../lib/payments'

import { Schema } from '../../../server/v1/handlers/payments'

describe("Listing Available Webhooks", async () => {

  it("GET /v1/api/account/payments get your account's paid invoices", async () => {

    let {account, invoice} = await utils.newAccountWithInvoice()

    var response = await utils.authRequest(account, {
      method: 'GET',
      url: '/v1/api/account/payments'
    })

    expect(response.statusCode).to.be.equal(200)
    expect(response.result.payments.length).to.be.equal(0)

    await recordPayment(invoice, {
      txid: '12345',
      currency: 'BSV',
      txhex: '11111111111'
    })

    response = await utils.authRequest(account, {
      method: 'GET',
      url: '/v1/api/account/payments'
    })

    let payment = response.result.payments[0]

    await Schema.listPayments.validate(payment)

    expect(response.statusCode).to.be.equal(200)

    expect(response.result.payments.length).to.be.equal(1)

    expect(payment.invoice.uid).to.be.equal(invoice.uid)

    expect(payment.invoice.currency).to.be.equal('USD')

    expect(payment.outputs).to.be.an('array')

    expect(payment.txid).to.be.a('string')

    expect(payment.createdAt).to.be.a('date')

  })

})

