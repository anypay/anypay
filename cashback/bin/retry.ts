#!/usr/bin/env ts-node
require('dotenv').config();

import * as program from 'commander'

import * as database from '../models';

import { getChannel, log } from 'rabbi';

program
  .command('all')
  .action(async () => {

    let uids = await database.sequelize.query(`select uid from invoices where id in (select invoice_id from cashback_customer_payments where currency is not null and transaction_hash is null and "createdAt" > '10-01-2019' and amount > 0 and currency in ('BCH', 'DASH') order by "createdAt" desc);`);

    let channel = await getChannel();

    await Promise.all(uids[0].map(async (row) => {
      console.log(row);

      log.info('retrycashbackforinvoice', { uid: row.uid }); 

      let message = Buffer.from(row.uid);

      await channel.sendToQueue('cryptozone:cashback:customers', message);

    }));

    process.exit(0);

  });

program
  .command('one <invoice_uid>')
  .action(async (uid) => {

    let channel = await getChannel();

    let message = Buffer.from(uid);

    await channel.sendToQueue('cryptozone:cashback:customers', message);

    setTimeout(() => {
    
      process.exit(0);

    }, 2000)
   

  });

program
  .parse(process.argv);
