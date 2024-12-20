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

import {
  accounts as Account,
  LinkedAccounts as LinkedAccount
} from '@prisma/client'

import { log } from '@/lib/log'
import prisma from '@/lib/prisma';

export async function listLinkedAccounts(account: { id: number }, options: any = {}): Promise<{ target: any[]; source: any[] }> {
  const source = await prisma.linkedAccounts.findMany({
    where: {
      source: account.id
    },
    include: {
      source_account: {
        select: {
          id: true,
          email: true
        }
      },
      target_account: {
        select: {
          id: true,
          email: true
        }
      }
    },

  });

  const target = await prisma.linkedAccounts.findMany({
    where: {
      target: account.id
    },
    include: {
      source_account: {
        select: {
          id: true,
          email: true
        }
      },
      target_account: {
        select: {
          id: true,
          email: true
        }
      }
    },

  });

  return {
    target: target,
    source: source
  };
}

export async function linkAccount(account: Account, { email }: { email: string }): Promise<LinkedAccount> {

  const target = await prisma.accounts.findFirstOrThrow({
    where: { email }
  });

  let record = await prisma.linkedAccounts.findFirst({
    where: {
      source: account.id,
      target: target.id
    }
  });

  if (!record) {

    record = await prisma.linkedAccounts.create({
      data: {
        source: account.id,
        target: target.id,
        createdAt : new Date(),
        updatedAt : new Date()
      }
    });
  }

  return record

}

export async function unlinkAccount(account: Account, {id}: {id: string}): Promise<void> {

  const link = await prisma.linkedAccounts.findFirst({
    where: { id: parseInt(id) }
  })

  log.info('accounts.unlink', { account_id: account.id, account_link_id: id })

  if (link && link.target === account.id || link && link.source === account.id) {

    await prisma.linkedAccounts.delete({
      where: { id: link.id }    
    })

  }

}

export async function getLink({ source, target }: { source: number, target: number }): Promise<LinkedAccount | null> {

  return await prisma.linkedAccounts.findFirst({
    where: {
      source,
      target
    }
  });

}

export {

  LinkedAccount

}
