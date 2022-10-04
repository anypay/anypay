
import { expect, account } from '../utils'

import { ensureAccessToken, AccessToken } from '../../lib/access_tokens'

describe('lib/access_tokens', () => {

  it('#ensureAccessToken should return a token for an account', async () => {

    const token: AccessToken = await ensureAccessToken(account)

    expect(token.get('uid')).to.be.a('string')

    expect(token.accessToken).to.be.a('string')

    expect(token.accessToken).to.be.not.equal(token.get('uid'))

  })

})
 