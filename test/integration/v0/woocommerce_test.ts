import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 Woocommrce", async () => {

  it("GET /woocommerce should return account woocommerce details", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/woocommerce'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
