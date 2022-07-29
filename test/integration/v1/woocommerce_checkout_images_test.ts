
import { auth, expect } from '../../utils'

import * as utils from '../../utils'

describe("Setting Your Woocommerce Image", async () => {

  it('should allow setting your image', async () => {

    const account = await utils.generateAccount()

    var response = await auth(account)({
      method: 'GET',
      url: '/v1/woocommerce/checkout_image'
    })

    expect(response.result.image.name).to.be.equal('ANYPAY');

    response = await auth(account)({
      method: 'PUT',
      url: `/v1/woocommerce/checkout_image`,
      payload: {
        name: "BTC"
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/woocommerce/checkout_image'
    })

    expect(response.statusCode).to.be.equal(200);

    expect(response.result.image.name).to.be.equal('BTC');

    expect(response.result.image.url).to.be.a('string');

  })

})

