
import { v0AuthRequest as auth, expect, account, chance } from '../../utils'

describe("API V0 - Firebase", async () => {

  it("POST /firebase_token should set the firebase token", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/firebase_token',
      payload: {
        firebase_token: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("PUT /firebase_token should set the firebase token", async () => {

    let response = await auth(account, {
      method: 'PUT',
      url: '/firebase_token',
      payload: {
        firebase_token: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})