import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 - Coins", async () => {

  it("GET /coins should return a list of account coins", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/coins'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})