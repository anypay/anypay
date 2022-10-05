
import { expect, server, chance, authHeaders  } from '../../utils'

import { registerAccount } from '../../../lib/accounts'

describe("API V0 Access Tokens", async () => {

  it("should provide a valid token given a username and password", async () => {

    const [email, password] = [chance.email(), chance.word()]

    await registerAccount(email, password)

    const headers = authHeaders(email, password)

    let response = await server.inject({
      method: 'POST',
      url: '/access_tokens',
      headers,
      payload: {
        email,
        password
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
