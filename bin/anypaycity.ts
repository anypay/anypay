#!/usr/bin/env ts-node

import * as program from 'commander';

import { models } from '../lib';

program
  .command('add <email> <city> [stub]')
  .action(async (email, city, stub) => {
    email = email.toLowerCase();

    let account = await models.Account.findOne({ where: { email }});

    if (!stub && !account.stub) {

      stub = account.business_name.replace(' ', '-');

      account.stub = stub;

      await account.save();

    }

    let [tag, isNew] = await models.AccountTag.findOrCreate({

      where: {
        tag: `city:${city}`,
        account_id: account.id
      },
      defaults: {
        tag: `city:${city}`,
        account_id: account.id
      }

    });

    process.exit(0); 

  });

program
  .parse(process.argv);
