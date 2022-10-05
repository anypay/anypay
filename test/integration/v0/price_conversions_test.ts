import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0", async () => {

  it("GET /convert/{oldamount}-{oldcurrency}/to-{newcurrency} should convert prices", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/convert/1-BSV/to-USD'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})