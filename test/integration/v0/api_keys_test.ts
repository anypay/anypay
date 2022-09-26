
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API - v0 - ApiKeys", async () => {

  it.skip("API Keys", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


})
