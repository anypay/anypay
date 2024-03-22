
import { expect, generateAccount } from '../utils'

import { ensureAccessToken } from '../../lib/access_tokens'

import { access_tokens as AccessToken } from '@prisma/client'

describe('lib/access_tokens', () => {

  it('#ensureAccessToken should return a token for an account', async () => {

    const account = await generateAccount()

    const token: AccessToken = await ensureAccessToken(account)

    expect(token.uid).to.be.a('string')

  })

})
 