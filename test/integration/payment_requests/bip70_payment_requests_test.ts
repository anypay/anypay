
import { expect, server } from '../../utils'

describe("API - Payments - BIP70", async () => {

  it("", async () => {

    let response = await server.inject({
        method: 'GET',
        url: '/base_currencies'
      })
  
      expect(response.statusCode).to.be.equal(200)
      
    
  })

})
