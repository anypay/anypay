
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API V0", async () => {

  it("GET /settings/denomination should return your account denomination", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/settings/denomination'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("PUT /settings/denomination should update your account denomination", async () => {

    let response = await auth(account, {
      method: 'PUT',
      url: '/settings/denomination',
      payload: {
        denomination: "RUB"
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})

