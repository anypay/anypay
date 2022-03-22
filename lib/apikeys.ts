
import { models } from './models'

import { createApp, createAppToken } from './apps'

export async function getMerchantApiKey(account_id) {

  let token = await models.AccessToken.findOne({
    where: {
      account_id
    },
    order: [["createdAt", "asc"]]
  })

  if (!token) {

    token = await models.AccessToken.create({
      account_id
    })

  }

  return token.uid

}

export async function getPlatformApiKey(account_id) {

  let app = await createApp({account_id, name: 'platform'})

  let token = await models.AccessToken.findOne({
    where: {
      account_id,
      app_id: app.id
    },
    order: [["createdAt", "asc"]]
  })

  if (!token) {

    token = await createAppToken(app.id)

  }

  return token.uid

}

