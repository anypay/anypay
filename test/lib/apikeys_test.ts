require('dotenv').config()

import { getMerchantApiKey, getPlatformApiKey } from '../../lib/apikeys'

import { createAccount, expect } from '../utils'

describe('API Keys', () => {

  it("should get the merchant api key", async () => {

    let account = await createAccount()

    let key = await getMerchantApiKey(account.id)

    expect(key).to.be.a('string')

  })

  it("should get the platform api key", async () => {

    let account = await createAccount()

    let key = await getPlatformApiKey(account.id)

    expect(key).to.be.a('string')

  })

})
