
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

import { expect, account, jwt, server } from '@/test/utils'

import * as passwords from '@/lib/password'

import { spy } from 'chai'

describe("/v1/api/account/password-reset", async () => {

  it('should return with success given an email address', async () => {

    spy.on(passwords, ['sendPasswordResetEmail'])

    await server.inject({
      method: 'POST',
      url: '/v1/api/account/password-reset',
      headers: {
        Authorization: `Bearer ${jwt}`      
      },
      payload: {
        email: account.email
      }
    })

    //expect(result.statusCode).to.be.equal(200)

    expect(passwords.sendPasswordResetEmail).to.have.been.called
  })

})
