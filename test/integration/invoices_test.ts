
import * as utils from '../utils'

import { expect } from '../utils'

describe('Integration | Invoices', () => {

  describe("POST /v1/api/invoices", () => {

    it('creates an invoice with valid access token', async () => {

      let [account] = await utils.createAccountWithAddress()

      let response = await utils.authRequest(account, {
        method: 'POST',
        url: '/v1/api/invoices',
        payload: {
          amount: 10
        }
      })

      const invoice = (response.result as any).invoice as any
      
      expect(response.statusCode).to.be.equal(201)

      expect(invoice.uid).to.be.a('string')

      expect(invoice.status).to.be.equal('unpaid')

      expect(invoice.amount).to.be.equal(10)

      expect(invoice.denomination).to.be.equal('USD')

    })

    it("should include payment options for invoice", async () => {

      let [account] = await utils.createAccountWithAddress()

      let response = await utils.authRequest(account, {
        method: 'POST',
        url: '/v1/api/invoices',
        payload: {
          amount: 10
        }
      })

      const result = response.result as any

      expect(result.payment_options[0].currency).to.be.equal('BSV')

    })

  })

  describe("Listing Events Related To Invoice", () => {

    it('gets the invoice events list from the API', async () => {

      let [account, invoice] = await utils.newAccountWithInvoice()

      let response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/invoices/${invoice.uid}/events`
      })

      expect(response.statusCode).to.be.equal(200)

      const result = response.result as any

      expect(result.events).to.be.an('array')

    })

  })

})
