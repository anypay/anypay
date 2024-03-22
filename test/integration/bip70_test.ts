
import { expect, request } from '../utils'

import * as utils from '../utils'

describe("End To End Payment Requests With BIP70 Protobufs", () => {

  describe("BCH", () => {

    it('should return a valid BIP70 payment request', async () => {

      const account = await utils.generateAccount()

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/bitcoincash-paymentrequest',
          'x-currency': 'BCH'
        })

      expect(resp.statusCode).to.be.equal(200)

    })

  })

  describe("BTC", () => {

    it.skip('should return a valid BIP70 payment request', async () => {

      const account = await utils.generateAccount()


      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/bitcoin-paymentrequest',
          'x-currency': 'BTC'
        })

      expect(resp.statusCode).to.be.equal(200)

    })
  
  })

  describe("DASH", () => {

    it('should return a valid BIP70 payment request', async () => {

      const account = await utils.generateAccount()

      let invoice = await utils.newInvoice({ amount: 0.02, account })

      let resp = await request
        .get(`/r/${invoice.uid}`) 
        .set({
          'Accept': 'application/dash-paymentrequest',
          'x-currency': 'DASH'
        })

      expect(resp.statusCode).to.be.equal(200)

    })
  
  })

})
