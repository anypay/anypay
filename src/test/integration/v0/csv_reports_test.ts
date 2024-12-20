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

import { expect, account, server } from '@/test/utils'

import { access } from '@/lib'

const { ensureAccessToken } = access

describe("API V0 - CSV", async () => {

  it("GET /csv_reports.csv should return a CSV report", async () => {

    const { uid } = await ensureAccessToken(account)

    let response = await server.inject({
      method: 'GET',
      url: `/csv_reports.csv?token=${uid}&start_date=${Date.now()}&end_date=${Date.now()}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /reports/csv/payments.csv should return a CSV report", async () => {

    const { uid } = await ensureAccessToken(account)

    let response = await server.inject({
      method: 'GET',
      url: `/reports/csv/payments.csv?token=${uid}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /csv_reports.csv should reject unauthorized attempts with no token", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/csv_reports.csv`
    })

    expect(response.statusCode).to.be.equal(400)
    
  })



  it("GET /reports/csv/payments.csv should reject unauthorized attempts with no token", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/reports/csv/payments.csv`
    })

    expect(response.statusCode).to.be.equal(400)
    
  })

})
