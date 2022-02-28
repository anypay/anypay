
import { expect } from './utils'

import * as utils from './utils'

import { AccessTokenV1, ensureAccessToken, Versions } from '../lib/access_tokens'

describe("Access Tokens", () => {

  describe("v1", () => {

    it("should find or create an access token for account", async () => {

      const account = await utils.generateAccount()  

      const token: AccessTokenV1 = await ensureAccessToken(account, Versions.AccessTokenV1);

      const json = token.toJSON()

      expect(json.account_id).to.be.equal(account.id)

      expect(token.get('account_id')).to.be.equal(account.id)
    
    })

  })

})

