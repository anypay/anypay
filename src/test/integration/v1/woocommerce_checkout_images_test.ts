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

import { expect, account, server, jwt } from '@/test/utils'

describe("Setting Your Woocommerce Image", async () => {

  it('should allow setting your image', async () => {

    var response = await server.inject({
      method: 'GET',
      url: '/v1/woocommerce/checkout_image',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    var result = response.result as any;

    expect(result.image.name).to.be.equal('ANYPAY');

    response = await server.inject({
      method: 'PUT',
      url: `/v1/woocommerce/checkout_image`,
      payload: {
        name: "BTC"
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    response = await server.inject({
      method: 'GET',
      url: '/v1/woocommerce/checkout_image',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    result = response.result

    expect(response.statusCode).to.be.equal(200);

    //expect(result.image.name).to.be.equal('BTC');

    expect(result.image.url).to.be.a('string');

  })

  it("GET /v1/woocommerce/checkout_images should list all available images", async () => {

    let response = await server.inject({
      method: 'GET',
      url: '/v1/woocommerce/checkout_images',
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    expect((response.result as any).images).to.be.an('object')
  })

  it("GET /v1/woocommerce/accounts/{account_id}/checkout_image.pngshould return chosen image for account", async () => {

    let response = await server.inject({
      method: 'GET',
      url: `/v1/woocommerce/accounts/${account.id}/checkout_image.png`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })

    expect(response.statusCode).to.be.equal(200)
  })

})