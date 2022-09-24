
import { account, expect } from '../utils'

import { createAccessToken, updateAccount } from '../../lib/accounts';

describe("Accounts library", () => {

  it("#createAccessToken should create an access token for an account id", async () => {

    const token = await createAccessToken(account.id)

    expect(token.get('account_id')).to.be.equal(account.id)
  })

  it("#update account should set the business name", async () => {

    const updated = await updateAccount(account, {
      business_name: 'Taco Deli'
    })

    expect(updated.get('id')).to.be.equal(account.id)

    expect(updated.get('business_name')).to.be.equal('Taco Deli')

  })

});
