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

import { registerAccount } from '@/lib/accounts'
import * as utils from '@/test/utils'

import { chance, expect } from '@/test/utils'

describe('Integration | Accounts', () => {

  describe("Listing Events Related To Account", () => {

    it('gets the account events list from the API', async () => {

      let account = await registerAccount(chance.email(), chance.string())

      let response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events`
      })

      const result = response.result as any

      console.log('--result--', result)
      
      expect(response.statusCode).to.be.equal(200)

      expect(result.events).to.be.an('array')

      expect(result.events[0].type).to.be.equal('account.created')

      expect(result.events[0].account_id).to.be.equal(account.id)

    })


    it('gets the account events list from the API in order', async () => {

      let [account] = await utils.newAccountWithInvoice()

      var order = 'asc'

      var response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events?order=${order}`
      })

      const result1 = response.result as any

      var [event1, event2] = result1.events

      expect(event2.id).to.be.greaterThan(event1.id)

      order = 'desc'

      response = await utils.authRequest(account, {
        method: 'GET',
        url: `/v1/api/account/events?order=${order}`
      })

      const result2 = response.result as any

      var [event3, event4] = result2.events

      expect(event3.id).to.be.greaterThan(event4.id)

    })

  })

})