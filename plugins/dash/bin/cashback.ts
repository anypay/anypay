#!/usr/bin/env ts-node

import * as program from 'commander';

import { getCashBackBalance } from '../lib/cashback';


program
  .command('getbalance')
  .action(async () => {

    try {

      let balance = await getCashBackBalance(); 

      console.log(`balance: ${balance}`);

      process.exit(0);

    } catch(error) {

      console.error(error.message);

      process.exit(1);

    }

  });

program
  .parse(process.argv);

