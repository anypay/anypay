import { auth, expect, account } from '../../utils'

describe("Setting Your Woocommerce Image", async () => {

  it('should allow setting your image', async () => {

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

  it("GET /v1/woocommerce/checkout_images should list all available images", async () => {

    let response = await auth(account)({
      method: 'GET',
      url: '/v1/woocommerce/checkout_images'
    })

    expect(response.result.images).to.be.an('object')
  })

  it("GET /v1/woocommerce/accounts/{account_id}/checkout_image.pngshould return chosen image for account", async () => {

    let response = await auth(account)({
      method: 'GET',
      url: `/v1/woocommerce/accounts/${account.id}/checkout_image.png`
    })

    expect(response.statusCode).to.be.equal(200)
  })

})