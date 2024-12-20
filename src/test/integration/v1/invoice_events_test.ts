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

import { createInvoice } from '@/lib/invoices'
import { expect, newAccountWithInvoice, log, jwt, server, account } from '@/test/utils'

describe("Invoice Events", async () => {

  it("GET /v1/api/invoices/{invoice_uid}/events should list events for invoice", async () => {

    const invoice = await createInvoice({
      amount: 100,
      account
    })

    let response = await server.inject({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}/events`,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
    })

    expect(response.statusCode).to.be.equal(200)

    expect((response.result as any).events).to.be.an('array')
    
  })


  it("should reject when requesting events for unauthorized invoice", async () => {

    const [another, invoice] = await newAccountWithInvoice()

    log.debug('test.account.another.created', another)

    let response = await server.inject({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}/events`,
      headers: {
        Authorization: `Bearer ${jwt}`
      },
    })

    expect(response.statusCode).to.be.equal(401)
    
  })


})
