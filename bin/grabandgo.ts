#!/usr/bin/env ts-node

import * as program from 'commander';

import { models } from '../lib';

program
  .command('createitem <account_stub> <name> <price> <stub>')
  .action(async (accountStub, name, price ,stub) => {


    let account = await models.Account.findOne({
      where: {
        stub: accountStub
      }
    });

    let [item] = await models.GrabAndGoItem.findOrCreate({
      where: {
        stub,
        account_id: account.id
      },
      defaults: {
        stub,
        name,
        price,
        account_id: account.id
      }
    });

    console.log('item created', item.toJSON());

  });

program
  .parse(process.argv);

