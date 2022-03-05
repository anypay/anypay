import * as utils from '../utils'

import { expect, server, chance, request, spy } from '../utils'

import { schema } from '../../lib/pay/json_v2'

import { ensureInvoice } from '../../lib/invoices'

describe("Listing Available Webhooks", async () => {

  it("GET /i/:uid requires accept and x-paypro-2 headers", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(400)
    expect(response.text).to.be.equal('Invalid Accept header')

  })

  it("GET /i/:uid returns payment options for invoice", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'GET',
      url: `/i/${invoice.uid}`,
      headers: {
        'Accept': 'application/payment-options',
        'x-paypro-version': 2
      }
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.PaymentOptions.response.validate(response.result)

    expect(valid.error).to.be.equal(null)

  })

  it("POST /i/:uid requires Content-Type and x-paypro-version", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    var response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(400)
    expect(response.text).to.be.equal('Invalid Content-Type')

    response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'Content-Type': 'application/payment-request'
      }
    })

    expect(response.statusCode).to.be.equal(400)
    expect(response.text).to.be.equal('Invalid x-paypro-version header')

    response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'Content-Type': 'application/payment-request',
        'x-paypro-version': 2
      }
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it("POST /i/:uid returns a payment request for chosen option", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'Content-Type': 'application/payment-request'
      }
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.PaymentRequest.response.validate(response.result)

    expect(valid.error).to.be.equal(null)

  })

  it("POST /i/:uid signs the payload with headers", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`
    })

    expect(response.headers['digest']).to.be.a('string')
    expect(response.headers['x-identity']).to.be.a('string')
    expect(response.headers['x-signature-type']).to.be.a('string')
    expect(response.headers['x-signature']).to.be.a('string')

  })

  it("POST /i/:uid should verify the payment is valid", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment-verification'
      }
    })

    let valid = schema.Protocol.PaymentVerification.response.validate(response.result)

  })

  it("POST /i/:uid should mark the invoice as paid", async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment'
      }
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.Payment.response.validate(response.result)

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.get('status')).to.be.equal('paid')

  })

})

