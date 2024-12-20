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

import * as uuid from 'uuid'
import { createApp, createAppToken } from '@/lib/apps'

import { access_tokens as AccessToken } from '@prisma/client'

import prisma from '@/lib/prisma'

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

