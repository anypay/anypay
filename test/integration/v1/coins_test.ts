import { expect, server } from '../../utils'

describe("API V1 Coins", async () => {

  it("GET /v1/api/system/coins should list system coins", async () => {

    const response = await server.inject({
      method: 'GET',
      url: '/v1/api/system/coins'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
