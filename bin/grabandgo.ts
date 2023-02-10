#!/usr/bin/env ts-node

import { Command } from 'commander';
const program = new Command();

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

