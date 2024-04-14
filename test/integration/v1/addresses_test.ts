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

import { auth, expect, account } from '../../utils'

describe("Setting Addresses Via REST", async () => {

  it('V1', async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    var response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses',
      payload: {
        address: address
      }
    })

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        address: address,
        currency: "BTC"
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses'
    })

    var response = await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        address: address2,
        currency: 'BTC'
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses'
    })

    expect(response.statusCode).to.be.equal(200);

  })

  it("POST /v1/api/account/addresses should set an address", async () => {

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
        currency: 'BSV'
      }
    })

  })


  it("DELETE /v1/api/account/addresses should remove an address", async () => {

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
        currency: 'BSV'
      }
    })

    await auth(account)({
      method: 'DELETE',
      url: `/v1/api/account/addresses/BSV`
    })

  })

})