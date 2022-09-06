import * as utils from '../utils'

import { wallet, expect, server } from '../utils'

import { schema } from '../../lib/pay/json_v2'

import { ensureInvoice } from '../../lib/invoices'

import { TestClient } from 'anypay-simple-wallet'

import * as bch from 'bitcore-lib-cash'

describe("JSON Payment Protocol V2", async () => {

  it.skip("GET /i/:uid requires accept and x-paypro-2 headers", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let response = await server.inject({
      method: 'GET',
      url: `/i/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(400)

  })

  it("GET /i/:uid returns payment options for invoice", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

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

    expect(valid.error).to.be.equal(undefined)

  })

  it("GET /r/:uid returns payment options for invoice", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let response = await server.inject({
      method: 'GET',
      url: `/r/${invoice.uid}`,
      headers: {
        'Accept': 'application/payment-options',
        'x-paypro-version': 2
      }
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.PaymentOptions.response.validate(response.result)

    expect(valid.error).to.be.equal(undefined)

  })

  it("POST /i/:uid requires Content-Type and x-paypro-version", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let { result } = await server.inject({
      method: 'GET',
      url: `/i/${invoice.uid}`,
      headers: {
        'Accept': 'application/payment-options',
        'x-paypro-version': 2
      }
    })

    var response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(400)

    response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'Content-Type': 'application/payment-request'
      }
    })

    expect(response.statusCode).to.be.equal(400)

    response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'content-type': 'application/payment-request',
        'x-paypro-version': 2
      },
      payload: result.paymentOptions[0]
    })
    
    expect(response.statusCode).to.be.equal(200)

  })

  it("POST /i/:uid returns a payment request for chosen option", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let { result } = await server.inject({
      method: 'GET',
      url: `/i/${invoice.uid}`,
      headers: {
        'Accept': 'application/payment-options',
        'x-paypro-version': 2
      }
    })

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment-request'
      },
      payload: result.paymentOptions[0]
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.PaymentRequest.response.validate(response.result)

    expect(valid.error).to.be.equal(undefined)

  })

  it("POST /r/:uid returns a payment request for chosen option", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let { result } = await server.inject({
      method: 'GET',
      url: `/r/${invoice.uid}`,
      headers: {
        'Accept': 'application/payment-options',
        'x-paypro-version': 2
      }
    })

    let response = await server.inject({
      method: 'POST',
      url: `/r/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment-request'
      },
      payload: result.paymentOptions[0]
    })

    expect(response.statusCode).to.be.equal(200)

    let valid = schema.Protocol.PaymentRequest.response.validate(response.result)

    expect(valid.error).to.be.equal(undefined)

  })

  it.skip("POST /i/:uid signs the payload with headers", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`
    })

    expect(response.headers['digest']).to.be.a('string')
    expect(response.headers['x-identity']).to.be.a('string')
    expect(response.headers['x-signature-type']).to.be.a('string')
    expect(response.headers['x-signature']).to.be.a('string')

  })
  
  it("POST /i/:uid should rejects invalid un-signed transaction upon payment verification", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02 })

    const transaction = new bch.Transaction()

    console.log('TRANS', transaction.serialize())

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment-verification'
      },
      payload: {
        chain: 'BCH',
        currency: 'BCH',
        transactions: [{
          tx: transaction.serialize()
        }]
      }
    })

    expect(response.result.statusCode).to.be.equal(400)
    expect(response.result.error).to.be.equal('Bad Request')

    console.log('MESSAGE:', response.result.message)

    expect(response.result.message.match('Missing required output'))
      .to.be.a('array')

  })

  if (!process.env.SKIP_E2E_PAYMENTS_TESTS) {

    it("POST /i/:uid should verify the payment is valid", async () => {

      let invoice = await utils.newInvoice({ amount: 0.02 })

      let response = await server.inject({
        method: 'POST',
        url: `/i/${invoice.uid}`,
        headers: {
          'x-paypro-version': 2,
          'Content-Type': 'application/payment-verification'
        }
      })

      schema.Protocol.PaymentVerification.response.validate(response.result)

    })

    it("POST /r/:uid should verify the payment is valid", async () => {

      let invoice = await utils.newInvoice({ amount: 0.02 })

      let response = await server.inject({
        method: 'POST',
        url: `/r/${invoice.uid}`,
        headers: {
          'x-paypro-version': 2,
          'Content-Type': 'application/payment-verification'
        }
      })

      schema.Protocol.PaymentVerification.response.validate(response.result)

    })

    it("POST /i/:uid should mark the invoice as paid", async () => {

      let invoice = await utils.newInvoice({ amount: 0.02 })

      let client = new TestClient(server, `/i/${invoice.uid}`)

      let { paymentOptions } = await client.getPaymentOptions()

      let paymentOption = paymentOptions.filter(option => {
        return option.currency === 'BSV'
      })[0]

      let paymentRequest = await client.selectPaymentOption(paymentOption)

      let payment = await wallet.buildPayment(paymentRequest.instructions[0].outputs)

      let response = await server.inject({
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

      expect(response.statusCode).to.be.equal(200)

      schema.Protocol.Payment.response.validate(response.result)

      invoice = await ensureInvoice(invoice.uid)

      expect(invoice.get('status')).to.be.equal('paid')

    })
  }

})

