

import { accounts as Account, access_tokens as AccessToken } from '@prisma/client'
import prisma from './prisma'

export async function ensureAccessToken(account: Account): Promise<AccessToken> {

  return prisma.access_tokens.create({
      
      data: {
        account_id: account.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
  })


}
