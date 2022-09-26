
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 - Base Currencies", async () => {

  it("GET /base_currencies should return a list of base denomination currencies available", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/base_currencies'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
