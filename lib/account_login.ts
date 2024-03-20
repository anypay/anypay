
import { log } from './log'

import { compare } from './bcrypt'

import {
  access_tokens as AccessToken
} from '@prisma/client'
import prisma from './prisma'
import * as uuid from 'uuid'

export async function withEmailPassword (email: string, password: string): Promise<AccessToken> {

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      email: email.toLowerCase()
    }
  })

  try {

    await compare(password, String(account.password_hash));

  } catch(error) {

    throw new Error('invalid password');
  }
  
  log.info(`password for email ${email} is correct`);

  return await prisma.access_tokens.create({
    data: {
      account_id: account.id,
      uid: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

};
