
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 - Products", async () => {

  it("GET /products should return a list of products", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/products'
    })

    console.log(response)

    expect(response.statusCode).to.be.equal(200)
    
  })

})
