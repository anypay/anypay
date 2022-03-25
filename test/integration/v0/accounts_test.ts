
import { auth, v0AuthRequest, expect } from '../../utils'

import * as utils from '../../utils'

describe("Managing Accounts over HTTP", async () => {

  it("GET /merchants/{account_id} should set the BTC address", async () => {

    let account = await utils.generateAccount()

    let response = await v0AuthRequest(account, {
      method: 'GET',
      url: `/merchants/${account.id}`
    })

    expect(response.statusCode).to.be.equal(200)

  })

})

