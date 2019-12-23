#!/usr/bin/env ts-node

import * as program from 'commander';

import { models } from '../lib';

program
  .command('createitem <account_stub> <name> <price> <stub>')
  .action(async (accountStub, name, price ,stub) => {

    console.log('createitem');

    try {


      let account = await models.Account.findOne({
        where: {
          stub: accountStub
        }
      });

      let [item, isNew] = await models.GrabAndGoItem.findOrCreate({
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

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('createsquareorder <invoice_uid>')
  .action((invoiceUid) => {

    /*
     * 1) Get Invoice from Database
     * 2) Look up grab and go item from order information
     * 3) Look up square item info from grab and go item record
     * 4) Create square order using API, marked as COMPLETED
     *
     */

  });

program
  .parse(process.argv);

