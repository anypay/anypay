
import { v0AuthRequest as auth, expect, account } from '../../utils'

describe("API - v0 - Anypaycity", async () => {

  it("/api/accounts-by-email/{email} should return the account public info", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: `/api/accounts-by-email/${account.email}`
    })

    expect(response.statusCode).to.be.equal(302)
    
  })


  it("/api/accounts-by-email/{email} should return a message for non user", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: `/api/accounts-by-email/invalid@gmail.com`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


})
