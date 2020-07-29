#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { database, models, leaderboard } from '../lib';

program
  .command('summary')
  .action(async () => {

    let summary: leaderboard.LeaderboardSummary = await leaderboard.getSummary();
    
    console.log(summary);

    process.exit(0);

  });


program
  .command('ls')
  .action(async () => {
    try {

      let list: any[] = await leaderboard.list();

      let allLength = list.length;

      list = list.filter((i: any) => {
        if (i.account.business_name) {
          return true;
        }
      });

      list.map((i: any) => {

        if (i.account.business_name) {
  
          console.log({ email: i.account.email, count: i.count })

          console.log({ business: i.account.business_name, email: i.account.email, count: i.count })

        }

      });

      console.log('# PAYMENTS', allLength);
      console.log('# WITH BUSINESS NAME', list.length);

    } catch(error) {

      console.error(error.message);

    }

    process.exit(0);

  });

program
  .parse(process.argv);
