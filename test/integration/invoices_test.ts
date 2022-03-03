
import * as utils from '../utils'

import { expect, server, spy } from '../utils'

import { Invoice } from '../../lib/invoices'

import { listInvoiceEvents } from '../../lib/events'

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
      
      expect(response.statusCode).to.be.equal(201)

      expect(response.result.invoice.uid).to.be.a('string')

      expect(response.result.invoice.status).to.be.equal('unpaid')

      expect(response.result.invoice.amount).to.be.equal(10)

      expect(response.result.invoice.denomination).to.be.equal('USD')

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

      expect(response.result.payment_options[0].currency).to.be.equal('BSV')

    })

    it.skip('fails to create invoice with invalid access token', async () => {

    })

    it.skip('fails to create invoice when address not set', async () => {

    })

    it.skip('creates an invoice for a specific coin only', async () => {

    })

    it.skip('creates an invoice for a specific coin only', async () => {

    })

    it.skip('creates an invoice specifying the denomination', async () => {

    })

  })

  describe("Getting Invoice Data", () => {

    it.skip("should have notes attached once they are created")

  })

  describe("Managing, Cancelling Invoice", () => {

  })

})
