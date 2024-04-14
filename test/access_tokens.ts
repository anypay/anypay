/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

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

