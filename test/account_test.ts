
import { expect, generateAccount } from './utils'

import { Account, findAccount } from '../lib/account'

describe("Account", () => {

  it("#findAccount should get an account by id", async () => {

    let account = new Account(await generateAccount())

    account = await findAccount(account.id)

    expect(account.id).to.be.greaterThan(0)

  })

})
