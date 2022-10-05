import { v0AuthRequest as auth, expect, account } from '../../utils'

import { ensureAccessToken } from '../../../lib/access_tokens'

describe("API V0 - Support Proxy", async () => {

  it("GET /support/{token} should notify us and redirect", async () => {

    const { uid: token } = await ensureAccessToken(account)

    let response = await auth(account, {
      method: 'GET',
      url: `/support/${token}`
    })

    expect(response.statusCode).to.be.equal(302)
    
  })

})