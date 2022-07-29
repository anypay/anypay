#!/usr/bin/env ts-node

import * as program from 'commander';

import { models } from '../lib';

program
  .command('createitem <email> <name> <price>')
  .action(async (email, name, price) => {

    console.log('createitem');

    try {


      let account = await models.Account.findOne({
        where: {
          email
        }
      });

      let item = await models.GrabAndGoItem.create({
        name,
        price,
        account_id: account.id
      });

      console.log('item created', item.toJSON());

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .parse(process.argv);

