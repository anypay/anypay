require('dotenv').config()

import { Account } from '../lib/account'

import { loginAccount, registerAccount, AccountAlreadyRegisteredError } from '../lib/accounts/registration'

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

})
