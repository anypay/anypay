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

require('dotenv').config();

import { log, accounts } from '@/lib';
import { getSupportedCoins } from '@/lib/accounts';
import { registerAccount } from '@/lib/accounts';
import { setAddress } from '@/lib/core';

import { Command } from 'commander';
import prisma from '@/lib/prisma';

const program = new Command();

program
  .command('listcoins <email>')
  .action(async (email) => {

    let account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    })

    let coins = await getSupportedCoins(account.id); 

    console.log(coins);

  });

program
  .command('afterregistered <email>')
  .action(async (email) => {

    let account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    })

    log.debug('account', account)

  });


program
  .command('update <email> <attribute> <value>')
  .action(async (email, attr, value) => {

    try {

      let account = await prisma.accounts.findFirstOrThrow({
        where: { email }
      })

      if (!account) {

        console.log(`account not found for email ${email}`);

        process.exit(0);

      }

      account = await prisma.accounts.update({
        where: {
          id: account.id
        },
        data: {
          [attr]: value
        }
      });

      console.log(account);

    } catch(error) {

      console.log(error);

      process.exit(0);
  
    }

  });



program
  .command('addtag <email> <tag>')
  .action(async (email, tag) => {
    try {

      const account = await prisma.accounts.findFirstOrThrow({
        where: { email }
      });

      var isNew = false;

      let accountTag = await prisma.account_tags.findFirst({
        where: {
          account_id: account.id,
          tag
        }
      });

      if (!accountTag) {

        isNew = true


        await prisma.account_tags.create({
          data: {
            account_id: account.id,
            tag,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }

      if (isNew) {

        console.log(`${email} tagged as "${tag}"`);

      } else {

        console.log(`${email} already tagged as "${tag}"`);

      }

    } catch(error: any) {
      
      console.error(error.message);

    }

    process.exit(0);

  });

program
  .command('removetag <email> <tag>')
  .action(async (email, tag) => {
    try {

      const account = await prisma.accounts.findFirstOrThrow({
        where: { email }
      });

      await prisma.account_tags.deleteMany({
        where: {
          account_id: account.id,
          tag
        }
      });

    } catch(error: any) {
      
      console.error(error.message);

    }

    process.exit(0);

  });


program
  .command('getaccount <email>')
  .action(async (email) => {

    let account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    })

    if (!account) {

      log.info(`account not found for email ${email}`);

    } else {

      log.info(`account found`, account);

    }

    process.exit();
 
  });

program
  .command('setaddress <email> <currency> <address> [chain]')
  .action(async (email, currency, address, chain) => {


    const account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    
    })

    await setAddress({

      account_id: account.id,

      currency,

      chain: chain || currency,

      address

    });

    console.log(`${currency} address set to ${address} for ${email}`);

    process.exit();

  });

program
  .command('getaddress <email> <currency>')
  .action(async (email, currency) => {

    const account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    });

    let accountCoins = await getSupportedCoins(account.id);

    console.log(accountCoins[currency]);

    process.exit(0);

  });

program
  .command('register <email> <password>')
  .action(async (email, password) => {

    let account = await registerAccount(email, password);

    log.info('account', account);

    process.exit(0);

  });

program
  .command('setname <email> <name>')
  .action(async (email, name) => {

    let account = await accounts.setName(email, name);

    log.info(account.toJSON());

    process.exit(0);

  });


program
  .command('setphysicaladdress <email> <address>')
  .action(async (email, address) => {

    let account = await accounts.setPhysicalAddress(email, address);

    log.info(account.toJSON());

    process.exit(0);

  });


program.parse(process.argv);

