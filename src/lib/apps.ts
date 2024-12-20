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

import { bsv } from 'scrypt-ts'

import {
  Apps as App,
  access_tokens as AccessToken
} from '@prisma/client'

import prisma from '@/lib/prisma';

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

  const token = await prisma.access_tokens.findFirst({
    where: {
      app_id: app.id
    }
  })

  if (token) {

    return token

  }

  return prisma.access_tokens.create({
    data: {
      account_id: app.account_id,
      app_id: app.id,
      uid: new bsv.PrivateKey().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

}
