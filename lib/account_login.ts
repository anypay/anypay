/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

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
