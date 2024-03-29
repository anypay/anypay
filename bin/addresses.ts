#!/usr/bin/env ts-node
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

import { Command } from 'commander';

const program = new Command();

import { addresses } from '../lib';
import prisma from '../lib/prisma';

program
  .command('lockaddress <email> <currency> [chain]')
  .action(async (email, currency, chain) => {


    const account = await prisma.accounts.findFirst({
      where: {
        email
      }
    })

    if (!account) {

      console.log(`account ${email} not found`);

      process.exit();

    }

    await addresses.lockAddress({
      account_id: account.id, currency, chain: chain || currency
    });
      
    process.exit()

  });

program
  .command('unlockaddress <email> <currency> [chain]')
  .action(async (email: string, currency: string, chain: string) => {

    const account = await prisma.accounts.findFirstOrThrow({
      where: {
        email
      }
    
    })

    await addresses.unlockAddress({
      account_id: account.id, currency, chain: chain || currency
    });

  });

program.parse(process.argv);
