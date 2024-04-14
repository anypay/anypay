/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import * as utils from '../utils'

import { expect, server, account } from '../utils'

import { schema } from '../../lib/pay/json_v2'

//@ts-ignore
import * as bch from 'bitcore-lib-cash'
import { config } from '../../lib/config'

describe("JSON Payment Protocol V2", async () => {

  it.skip("GET /i/:uid requires accept and x-paypro-2 headers", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02, account })

    let response = await server.inject({
      method: 'GET',
      url: `/i/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(400)

  })

  it("GET /i/:uid returns payment options for invoice", async () => {

    let invoice = await utils.newInvoice({ amount: 0.02, account })

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

    let invoice = await utils.newInvoice({ amount: 0.02, account })

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
    
    let invoice = await utils.newInvoice({ amount: 0.02, account })

    let { result }: { result: any } = await server.inject({
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

    let invoice = await utils.newInvoice({ amount: 0.02, account })

    let { result }: { result: any } = await server.inject({
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

    let invoice = await utils.newInvoice({ amount: 0.02, account })

    let { result }: { result: any } = await server.inject({
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

    let account = await utils.generateAccount()

    let invoice = await utils.newInvoice({ amount: 0.02, account })

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

    let invoice = await utils.newInvoice({ amount: 0.02, account })

    const transaction = new bch.Transaction()

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

    expect(response.statusCode).to.be.equal(400)

  })

  if (config.get('run_e2e_payment_tests')) {

    it("POST /i/:uid should verify the payment is valid", async () => {

      let invoice = await utils.newInvoice({ amount: 0.02, account })

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

      let invoice = await utils.newInvoice({ amount: 0.02, account })

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

    /*

    it("POST /i/:uid should mark the invoice as paid", async () => {

      let account = await utils.generateAccount()

      let invoice = await utils.newInvoice({ amount: 0.02, account })

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

    */
  }

})

