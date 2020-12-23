
import * as assert from 'assert';

import { server, generateAccount } from './utils'

describe("Payment Requests", async () => {

  var account;

  before(async () => {

    account = await generateAccount()

  })

  describe("BIP70 Payments", () => {

    it('#GET /r/{uid} with proper header should return DASH BIP70 request', async () => {

      let uid = 1234

      let response = await server.inject({
        method: 'GET',
        url: `/r/${uid}`,
        headers: {
          'accept': 'application/dash-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/dash-paymentrequest')

    })

    it('#GET /r/{uid} with proper header should return BCH BIP70 request', async () => {

      let uid = 1234

      let response = await server.inject({
        method: 'GET',
        url: `/r/${uid}`,
        headers: {
          'accept': 'application/bitcoincash-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/bitcoincash-paymentrequest')

    })

    it('#GET /r/{uid} with proper header should return BTC BIP70 request', async () => {

      let uid = 1234

      let response = await server.inject({
        method: 'GET',
        url: `/r/${uid}`,
        headers: {
          'accept': 'application/bitcoin-paymentrequest'
        }
      })

      assert.strictEqual(response.headers['content-type'], 'application/bitcoin-paymentrequest')

    })

  })

  describe("BIP270 Payments", () => {

    it('#GET /r/{uid} with proper header should return BIP270 request', async () => {

    })

    it('#GET /r/{uid} with no header should return BIP270 request', async () => {

    })

  })

  describe("JSON Payments", () => {

    it('#GET /r/{uid} with proper header should return JSON request', async () => {

    })

  })

})

