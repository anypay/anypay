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

import {  createAuthHeader, expect, server  } from '../utils'

import * as utils from '../utils'

describe("Setting Addresses Via REST", async () => {


  it("PUT /addresses/DASH should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const account = await utils.generateAccount()

    const response: any = await server.inject({
      method: 'put',
      url: '/addresses/DASH',
      payload: {
        address: address
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.result.value).to.be.equal(address);

  })

  it("PUT /addresses/BTC should set the BTC address", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const account = await utils.generateAccount()


    return server.inject({
      method: 'put',
      url: '/addresses/BTC',
      payload: {
        address: address
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

  })

  it("GET /addresses should return a list of account addresses", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const account = await utils.generateAccount()

    var response = await server.inject({
      method: 'put',
      url: '/addresses/BTC',
      payload: {
        address: address
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.result).to.deep.equal({});

    const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    await server.inject({
      method: 'put',
      url: '/addresses/BTC',
      payload: {
        address: address
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    response = await server.inject({
      method: 'get',
      url: '/addresses',
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(Object.keys(response.result as {}).length).to.be.equal(1);

    await server.inject({
      method: 'PUT',
      url: '/addresses/DASH',
      payload: {
        address: address2
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    var response1: any = await server.inject({
      method: 'GET',
      url: '/addresses',
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response1.statusCode).to.be.equal(200);

    expect(Object.keys(response1.result as {}).length).to.be.equal(2);

    expect(response1.result['BTC']).to.be.equal(address);

    expect(response1.result['DASH']).to.be.equal(address2);

  })

  it("POST /api/v1/addresses should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const chain = 'DASH'

    const currency = 'DASH'

    const account = await utils.generateAccount()


    const response: any = await server.inject({
      method: 'POST',
      url: '/api/v1/addresses',
      payload: {
        address: address,
        chain,
        currency
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.result.value).to.be.equal(address);
    expect(response.result.chain).to.be.equal(chain);
    expect(response.result.currency).to.be.equal(currency);

  })

  it("POST /api/v1/addresses should set the USDC address", async () => {

    var address = '0x029b705658D7De7c98176F0290cd282a0b9D1486';

    const chain = 'ETH'

    const currency = 'USDC'

    const account = await utils.generateAccount()


    const response: any = await server.inject({
      method: 'POST',
      url: '/api/v1/addresses',
      payload: {
        address: address,
        chain,
        currency
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.result.value).to.be.equal(address);

    expect(response.result.chain).to.be.equal(chain);

    expect(response.result.currency).to.be.equal(currency);

  })

  it("POST /api/v1/addresses should require both chain and currency", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const currency = 'DASH'

    const account = await utils.generateAccount()


    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/addresses',
      payload: {
        address: address,
        currency
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.statusCode).to.equal(400)

  })

  it("POST /api/v1/addresses should not allow unsupported coins", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const currency = 'XXX'

    const chain = 'BTC'

    const account = await utils.generateAccount()


    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/addresses',
      payload: {
        address: address,
        chain,
        currency
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.statusCode).to.equal(400)

  })


  it("POST /api/v1/addresses should not allow unsupported chains", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    const currency = 'USDC'

    const chain = 'BTC'

    const account = await utils.generateAccount()


    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/addresses',
      payload: {
        address: address,
        chain,
        currency
      },
      headers: {
        Authorization: await createAuthHeader(account)
      }
    })

    expect(response.statusCode).to.equal(400)

  })
})

