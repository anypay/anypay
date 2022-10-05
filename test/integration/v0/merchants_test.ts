
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 - Merchants", async () => {

  it("GET /merchants/{account_id} should return merchant info", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: `/merchants/${account.id}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})