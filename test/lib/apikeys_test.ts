
import { createAccount } from '../utils'

import { getMerchantApiKey, getPlatformApiKey } from '../../lib/apikeys'

describe('API Keys', () => {

  it("should get the merchant api key", async () => {

    let account = await createAccount()

    let key = await getMerchantApiKey(account)

    console.log(key)

  })

  it("should get the platform api key", async () => {

    let account = await createAccount()

    let key = await getPlatformApiKey(account)

    console.log(key)

  })

})
