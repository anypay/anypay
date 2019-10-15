#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { database, models } from '../lib';

program
  .command('ls')
  .action(async () => {
    try {

      let accountInvoicesCounts = await database.query(`select account_id, count(*) from
          invoices where status = 'paid' and "createdAt" > '07-01-2019' group by
          account_id order by count desc;`);


      let result = await Promise.all(accountInvoicesCounts[0].map(async (i) => {

        let account = await models.Account.findOne({where: { id: i.account_id }})

        return {
          account_id: i.account_id,
          count: i.count,
          account: account.toJSON()
        }

      }));

      result.map((i: any) => {

        console.log({ email: i.account.email, count: i.count })

      });

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .parse(process.argv);
