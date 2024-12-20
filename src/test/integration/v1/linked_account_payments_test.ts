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

import { generateAccountToken } from '@/lib/jwt'
import { expect, account, generateAccount, server, jwt } from '@/test/utils'

describe("Linked Account Payments", async () => {

    it("GET /v1/api/linked-accounts/{account_id}/payments list payments of linked account", async () => {

        const targetAccount = await generateAccount()

        await server.inject({
          method: 'POST',
          url: '/v1/api/linked-accounts',
          headers: {
            Authorization: `Bearer ${jwt}`
          },
          payload: {
            email: targetAccount.email
          }
        })

        const targetJwt = await generateAccountToken({account_id: targetAccount.id, uid: String(targetAccount.id)})
     
        let response = await server.inject({
          method: 'GET',
          url: `/v1/api/linked-accounts/${account.id}/payments`,
          headers: {
            Authorization: `Bearer ${targetJwt}`
          },
        })
    
        expect(response.statusCode).to.be.equal(200)
        
      })


    it("should return unauthorized for missing link", async () => {

        const targetAccount = await generateAccount()

        await server.inject({
          method: 'POST',
          url: '/v1/api/linked-accounts',
          headers: {
            Authorization: `Bearer ${jwt}`
          },
          payload: {
            email: targetAccount.email
          }
        })

        const targetJwt = await generateAccountToken({account_id: targetAccount.id, uid: String(targetAccount.id)})
             
        let response = await server.inject({
          method: 'GET',
          url: `/v1/api/linked-accounts/7777777/payments`,
          headers: {
            Authorization: `Bearer ${targetJwt}`
          },
        })
    
        expect(response.statusCode).to.be.equal(401)
        
      })
    
    
})
