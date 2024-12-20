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

import { v0AuthRequest as auth, expect, account } from '@/test/utils'

describe("API - v0 - Anypaycity", async () => {

  it("/api/accounts-by-email/{email} should return the account public info", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: `/api/accounts-by-email/${account.email}`
    })

    expect(response.statusCode).to.be.equal(302)
    
  })


  it("/api/accounts-by-email/{email} should return a message for non user", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: `/api/accounts-by-email/invalid@gmail.com`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


})