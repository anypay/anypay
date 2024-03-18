

import * as uuid from 'uuid'
import { createApp, createAppToken } from './apps'

import { access_tokens as AccessToken } from '@prisma/client'

import prisma from './prisma'

export async function getMerchantApiKey(account_id: number): Promise<string> {

  let accessToken: AccessToken | null = await prisma.access_tokens.findFirst({
    where: {
      account_id,
    }
  })

  if (!accessToken) {

    accessToken = await prisma.access_tokens.create({
      data: {
        account_id,
        uid: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  }

  return String(accessToken.uid)

}

export async function getPlatformApiKey(account_id: number) {

  let app = await createApp({account_id, name: 'platform'})

  let accessToken = await prisma.access_tokens.findFirst({
    where: {
      account_id,
      app_id: app.id
    },
    orderBy: {
      createdAt: 'asc'
    }
  })


  if (!accessToken) {

    accessToken = await createAppToken(app.id)

  }

  return String(accessToken?.uid)

}

