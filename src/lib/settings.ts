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
import { log } from '@/lib/log'
import prisma from '@/lib/prisma'

export async function getAccountSetting(account_id: number, key: string, options: { default?: string} = {}) {

  let record = await prisma.account_settings.findFirst({
    where: {
      account_id,
      key
    }
  })

  if (record) { return record.value }

  return options.default

}
export async function setAccountSetting(account_id: number, key: string, value: any) {

  log.info('account.settings.update', {account_id, key, value })


  let record = await prisma.account_settings.findFirst({
    where: {
      account_id,
      key
    }
  })

  if (!record) {

    record = await prisma.account_settings.create({
      data: {
        account_id,
        key,
        value,
        updatedAt: new Date(),
        createdAt: new Date()
      }  
    })
  }


  record = await prisma.account_settings.update({
    where: {
      id: record.id
    },
    data: {
      value,
      updatedAt: new Date()
    }
  })
  
  return record

}

async function setDenomination(account_id: number, denomination: string): Promise<string> {

  await prisma.accounts.update({
    where: {
      id: account_id
    },
    data: {
      denomination
    }
  
  })

  log.info('account.denomination.set', { account_id, denomination })

  return denomination;

}

async function getDenomination(accountId: number): Promise<string> {

  const account = await prisma.accounts.findFirstOrThrow({
    where: {
      id: accountId
    }
  
  })

  return String(account.denomination);

}

export {
  getDenomination,
  setDenomination
}

