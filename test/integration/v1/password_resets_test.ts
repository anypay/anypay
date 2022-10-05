
import { auth, expect, account } from '../../utils'

import * as passwords from '../../../lib/password'

import { spy } from 'chai'

describe("/v1/api/account/password-reset", async () => {

  it('should return with success given an email address', async () => {

    spy.on(passwords, ['sendPasswordResetEmail'])

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/password-reset',
      payload: {
        email: account.email
      }
    })

    //expect(result.statusCode).to.be.equal(200)

    expect(passwords.sendPasswordResetEmail).to.have.been.called
  })

})
