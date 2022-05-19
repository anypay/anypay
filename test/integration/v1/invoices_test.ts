
import { auth, expect, server } from '../../utils'

import { DEFAULT_WEBHOOK_URL } from '../../../lib/webhooks'

import * as utils from '../../utils'

import { buildPayment }  from '../../../plugins/bsv/lib/wallet'

import { TestClient } from 'anypay-simple-wallet'

describe("Invoices V1", async () => {

  it("POST /invoices should use default webhook url", async () => {

    let [account] = await utils.createAccountWithAddress()

    let response = await auth(account)({
      method: 'POST',
      url: `/v1/api/invoices`,
      payload: {
        amount: 10 
      }
    })

    expect(response.statusCode).to.be.equal(201)

    expect(response.result.invoice.webhook_url).to.be.equal(DEFAULT_WEBHOOK_URL)

  })

  it.skip("GET /v1/api/invoices/{uid} includes payment for a paid invoice", async () => {

    // create invoice
    // send payment
    // get invoice
    // assert payment txid
    // assert payment outputs
    // assert invoice paid

    let [account] = await utils.createAccountWithAddress()

    var response = await auth(account)({
      method: 'POST',
      url: `/v1/api/invoices`,
      payload: {
        amount: 0.02 
      }
    })

    let invoice = response.result.invoice

    response = await auth(account)({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}`,
    })

    expect(response.result.invoice.status).to.be.equal('unpaid')

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'BSV'
    })[0]

    let paymentRequest = await client.selectPaymentOption(paymentOption)

    let payment = await buildPayment(paymentRequest)

    response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment'
      },
      payload: {
        transactions: [{ tx: payment }],
        chain: 'BSV',
        currency: 'BSV'
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}`,
    })

    expect(response.result.invoice.currency).to.be.equal('USD')

    expect(response.result.invoice.amount).to.be.equal(0.02)

    expect(response.result.invoice.status).to.be.equal('paid')

    expect(response.result.payment.currency).to.be.equal('BSV')

    expect(response.result.payment.txid).to.be.a('string')

    expect(response.result.payment.txhex).to.be.a('string')

  })

  it("GET /v1/api/invoices/{uid}/events should show event log for invoice", async () => {

    let [account] = await utils.createAccountWithAddress()

    var response = await auth(account)({
      method: 'POST',
      url: `/v1/api/invoices`,
      payload: {
        amount: 10 
      }
    })

    let invoice = response.result.invoice

    response = await auth(account)({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}/events`,
    })

    console.log('response', response.result.events[0])

    expect(response.result.events[0].type).to.be.equal('invoice.created')

  })

})

