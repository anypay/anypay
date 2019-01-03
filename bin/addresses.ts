#!/usr/bin/env ts-node

import * as program from 'commander';

import { models, addresses } from '../lib';

program
  .command('lockaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: {

      email

    }});

    if (!account) {

      console.log(`account ${email} not found`);

      process.exit();

    }

    await addresses.lockAddress(account.id, currency);
      
    process.exit()

  });

program
  .command('unlockaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: {

      email

    }});

    if (!account) {

      console.log(`account ${email} not found`);

      process.exit();

    }

    await addresses.unlockAddress(account.id, currency);

  });

program.parse(process.argv);
