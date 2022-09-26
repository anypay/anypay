
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0 - Kraken API Keys", async () => {

  it("POST /kraken_api_keys should add api keys", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/kraken_api_keys',
      payload: {
        api_key: '1234',
        api_secret: '5678'
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("GET /kraken_api_keys should list api keys", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/kraken_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("DELETE /kraken_api_keys should remove api keys", async () => {

    let response = await auth(account, {
      method: 'DELETE',
      url: '/kraken_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)

    await auth(account, {
      method: 'GET',
      url: '/kraken_api_keys'
    })
    
  })

})
