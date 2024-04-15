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

import { v0AuthRequest, expect, server, createAuthHeader } from '../../utils'

import { accounts as Account } from '@prisma/client'

import * as utils from '../../utils'

describe("Setting Addresses Via REST", async () => {
  var account: Account;
  
  before(async () => {
  
    account = await utils.generateAccount()

  });


  it("PUT /addresses/DASH should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const account = await utils.generateAccount()

    const authHeader = await createAuthHeader(account)

    console.log({ authHeader })

    const response: any = await server.inject({
      method: 'put',
      url: '/addresses/DASH',
      payload: {
        address: address
      },
      headers: {
        Authorization: `Basic ${authHeader}`
      }
    })

    console.log('--DASH--', response.result)

    expect(response.result.value).to.be.equal(address);

  })

  it("PUT /addresses/BTC should set the BTC address", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    let response = await v0AuthRequest(account, {
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address
      }
    })

    const result = response.result as any;

    expect(result.value).to.be.equal(address);

  })

  it("GET /addresses should return a list of account addresses", async () => {

    const account = await utils.generateAccount()

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    await v0AuthRequest(account, {
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address
      }
    })

    var response = await v0AuthRequest(account, {
      method: 'GET',
      url: '/addresses',
      payload: {
        address
      }
    })

    const result = response.result as any;

    expect(result['BTC']).to.be.equal(address)

  })

})

