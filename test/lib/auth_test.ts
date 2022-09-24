
import { expect, account } from '../utils'

import { ensureAccessToken } from '../../lib/access_tokens'

import { Account } from '../../lib/account'

import { authorizeAccount } from '../../lib/auth'

describe('lib/auth', () => {


    describe("#authorizeAccount", () => {

        it('should verify a token and return an account', async () => {

            const token = await ensureAccessToken(account)

            const authorized: Account = await authorizeAccount(token.accessToken)

            expect(authorized.id).to.be.equal(account.id)
        
        })

    })

})
 