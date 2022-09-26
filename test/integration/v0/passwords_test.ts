
import { v0AuthRequest as auth, expect, account } from '../../utils'

import { createPasswordReset } from '../../../lib/password'

describe("API V0 - Passwords", async () => {

  it("POST /password-resets should send password reset email", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/password-resets',
      payload: {
        email: account.email
      }
    })

    console.log(response)

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("POST /password-resets/{uid} should allow claim token to reset password", async () => {

    const { uid } = await createPasswordReset(account.email)

    let response = await auth(account, {
      method: 'POST',
      url: `/password-resets/${uid}`,
      payload: {
        password: 'my-new-password'
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("POST /password-resets/{uid} should reject with invalid reset", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: `/password-resets/50b6342e-2d90-4522-b272-b892652802b9`,
      payload: {
        password: 'my-new-password'
      }
    })

    expect(response.statusCode).to.be.equal(404)
    
  })

})
