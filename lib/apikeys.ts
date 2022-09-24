

import { createApp } from './apps'

import { AccessToken, ensureAccessToken, ensureAppAccessToken } from './access_tokens'

import { Account } from './account'

export async function getMerchantApiKey(account: Account): Promise<AccessToken> {

  return ensureAccessToken(account)

}

export async function getPlatformApiKey(account: Account): Promise<AccessToken> {

  const name = '@platform'

  const account_id = account.id

  const app = await createApp({
    account_id,
    name
  })

  return ensureAppAccessToken(app, account)

}
