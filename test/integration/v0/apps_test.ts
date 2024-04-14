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

import { v0AuthRequest as auth, expect, account, chance } from '../../utils'

describe("API V0", async () => {

  it("GET /apps should return a list of your apps", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/apps'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("POST /apps should create a new app", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/apps',
      payload: {
        name: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("GET /apps/{id} should return details of a single app", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/apps',
      payload: {
        name: chance.word()
      }
    })


    let { statusCode } = await auth(account, {
      method: 'GET',
      url: `/apps/${response.result.app.id}`
    })

    expect(statusCode).to.be.equal(200)
    
  })

  it("GET /apps/{id} should return empty with invalid app id", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/apps/777777'
    })

    expect(response.statusCode).to.be.equal(404)
    
  })

})
