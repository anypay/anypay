
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0", async () => {

  it("", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
