
import * as assert from 'assert';

import { server, generateAccount, generateInvoice } from './utils'

describe("Payment Requests", async () => {

  var account;

  before(async () => {

    account = await generateAccount()

  })

  describe("BIP70 Payments", () => {

    it('#GET /r/{invoice.uid} with proper header should return DASH BIP70 request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'DASH')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/dash-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/dash-paymentrequest')

    })

    it('#GET /r/{invoice.uid} with proper header should return BCH BIP70 request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BCH')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/bitcoincash-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/bitcoincash-paymentrequest')

    })

    it('#GET /r/{invoice.uid} with proper header should return BTC BIP70 request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BTC')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/bitcoin-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/bitcoin-paymentrequest')

    })

  })

  describe("BIP270 Payments", () => {

    it('#GET /r/{invoice.uid} with proper header should return BIP270 request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BSV')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/bitcoinsv-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

    })


    it('#GET /r/{invoice.uid} with no header should return BIP270 request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BSV')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`
      })

      assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

    })

  })

  describe("JSON Payments", () => {

    it('#GET /r/{invoice.uid} with proper header should return DASH JSON request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'DASH')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/payment-request',
          'x-currency': 'DASH'
        }
      })

      console.log(response)

      assert.strictEqual(response.headers['content-type'], 'application/payment-request')

    })

    it('#GET /r/{invoice.uid} with proper header should return BSV JSON request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BSV')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/payment-request',
          'x-currency': 'BSV'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/payment-request')

    })

    it('#GET /r/{invoice.uid} with proper header should return BTC JSON request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BTC')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/payment-request',
          'x-currency': 'BTC'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/payment-request')

    })

    it('#GET /r/{invoice.uid} with proper header should return LTC JSON request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'LTC')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/payment-request',
          'x-currency': 'LTC'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/payment-request')

    })

    it('#GET /r/{invoice.uid} with proper header should return BCH JSON request', async () => {

      let invoice = await generateInvoice(account.id, 0.1, 'BCH')

      let response = await server.inject({
        method: 'GET',
        url: `/r/${invoice.uid}`,
        headers: {
          'accept': 'application/payment-request',
          'x-currency': 'BCH'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/payment-request')

    })

  })

})

