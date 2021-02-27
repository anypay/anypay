#!/usr/bin/env ts-node
require('dotenv').config()

import * as program from 'commander';

import { discount, models } from '../lib';

program
  .command('setdiscount <email> <currency> <percent>')
  .action(async (email, currency, percent) => {

    try {

      let account = await models.Account.findOne({
        where: {
          email
        }
      })

      let record = await discount.set({ account_id: account.id, currency, percent })

      console.log(record.toJSON())

    } catch(error) {

      console.error(error)

    }

    process.exit()

  });

program.parse(process.argv);
