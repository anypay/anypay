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

import { log } from '../lib'
import { createApp } from '../lib/apps'
import prisma from '../lib/prisma'
import * as uuid from 'uuid'

export default async function() {

  log.info('initializers.prometheus')

  let account = await prisma.accounts.findFirst({
    where: {
      email: 'prometheus'
    }
  })

  if (!account) {

    account = await prisma.accounts.create({
      data: {
        email: 'prometheus',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  }

  try {

    let app = await prisma.apps.findFirst({
      where: {
        name: 'prometheus',
        account_id: account.id
      }
    })

    var isNew = app ? false : true

    if (!app) {
        
        app = await createApp({
          name: 'prometheus',
          account_id: account.id,
        })

    }

    if (isNew) {

      const accessToken = await prisma.access_tokens.create({
        data: {
          app_id: app.id,
          account_id: account.id,
          uid: uuid.v4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })


      console.log('=======   Prometheus Access Token Generated   =======')
      console.log(`=======                                       =======`)
      console.log(`=======  ${accessToken.uid}  =======` )
      console.log(`=======                                       =======`)
      console.log('=====================================================')

    }

  } catch(error) {

    console.error('error initializing prometheus', error)

  }

}
