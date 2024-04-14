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

import { createInvoice } from '../../lib/invoices'
import * as utils from '../utils'

import { expect, account } from '../utils'

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

      expect(invoice.denomination_currency).to.be.equal('USD')

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

      const invoice = await createInvoice({ amount: 10, account })

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
