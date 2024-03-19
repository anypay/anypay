
import { bsv } from 'scrypt-ts'

import {
  Apps as App,
  access_tokens as AccessToken
} from '@prisma/client'

import prisma from './prisma';

interface NewApp {
  name: string;
  account_id: number;
}
export async function createApp(params: NewApp): Promise<App> {

  let privkey = new bsv.PrivateKey()

      return  prisma.apps.create({
        data: {
          name: params.name,
          account_id: params.account_id,
          public_key: privkey.toPublicKey().toString(),
          private_key: privkey.toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

}

export async function createAppToken(id: number): Promise<AccessToken> {

  const app = await prisma.apps.findFirstOrThrow({
    where: {
      id
    }
  })

  return prisma.access_tokens.create({
    data: {
      account_id: app.account_id,
      app_id: app.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

}
