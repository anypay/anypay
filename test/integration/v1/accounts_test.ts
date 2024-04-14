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

import * as utils from '../../utils'

import { expect } from '../../utils'

describe('Integration | Accounts', () => {

  describe("Listing Events Related To Account", () => {

    it('gets the account events list from the API', async () => {

      let account = await utils.createAccount()

      let response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events`
      })
      
      expect(response.statusCode).to.be.equal(200)

      expect(response.result.events).to.be.an('array')

      expect(response.result.events[0].type).to.be.equal('account.created')

      expect(response.result.events[0].account_id).to.be.equal(account.id)

    })


    it('gets the account events list from the API in order', async () => {

      let [account] = await utils.newAccountWithInvoice()

      var order = 'asc'

      var response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events?order=${order}`
      })

      var [event1, event2] = response.result.events

      expect(event2.id).to.be.greaterThan(event1.id)

      order = 'desc'

      response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events?order=${order}`
      })

      var [event3, event4] = response.result.events

      expect(event3.id).to.be.greaterThan(event4.id)

    })

  })

})