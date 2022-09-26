require('dotenv').config()

import { Account } from '../lib/account'

import { ses } from '../lib/email/ses'

import {

  loginAccount,

  registerAccount,

  AccountAlreadyRegisteredError,


} from '../lib/registration'

import { passwordResetEmail } from '../lib/password_reset'

import { chance, expect, spy } from './utils'

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

  it("should send password reset email", async () => {

    const email = chance.email();

    const password = chance.word();

    await registerAccount({ email, password })

    spy.on(ses, 'sendEmail')

    let passwordReset = await passwordResetEmail(email)

    expect(passwordReset.get('email')).to.be.equal(email)

    expect(passwordReset.get('id')).to.be.greaterThan(0)

    expect(ses.sendEmail).to.have.been.called()

  })

})

