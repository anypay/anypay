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

require('dotenv').config()

import { accounts as Account } from '@prisma/client'


import {

  loginAccount,

  registerAccount,

  AccountAlreadyRegisteredError,


} from '../lib/accounts/registration'

//import { passwordResetEmail } from '../lib/password_reset'

//import { chance, expect, spy } from './utils'
import { chance, expect } from './utils'

describe("User Authentication", () => {
  
  it("register account should prevent duplicate accounts", async () => {

    const email = chance.email();

    const password = chance.word();

    let account: Account = await registerAccount({ email, password })

    expect(account.email).to.be.equal(email)

    expect(

      registerAccount({ email, password })

    )
    .to.be.eventually.rejectedWith(`account with email ${email} already registered`)

    expect(

      registerAccount({ email, password })

    )
    .to.be.eventually.rejectedWith(new AccountAlreadyRegisteredError(email))

  })

  it("should log in account and register the login attempt", async () => {

    const email = chance.email();

    const password = chance.word();

    await registerAccount({ email, password })

    let account = await loginAccount({ email, password })

    expect(account.email).to.be.equal(email)

    expect(account.id).to.be.greaterThan(0)

  })

  it.skip("should send password reset email", async () => {

    /*const email = chance.email();

    const password = chance.word();

    await registerAccount({ email, password })

    spy.on(ses, 'sendEmail')

    let passwordReset = await passwordResetEmail(email)

    expect(passwordReset.get('email')).to.be.equal(email)

    expect(passwordReset.get('id')).to.be.greaterThan(0)

    expect(ses.sendEmail).to.have.been.called()
    */

  })

})

