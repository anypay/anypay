#!/usr/bin/env ts-node

import * as program from 'commander';

import { getCashBackBalance, sendToAddress } from '../lib/cashback';

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
  .command('sendtoaddress <address> <amount>')
  .action(async (address, amount) => {

    try {

      let result = await sendToAddress(address, amount); 

      console.log(`result: ${result}`);

      process.exit(0);

    } catch(error) {

      console.error(error.message);

      process.exit(1);

    }
  });

program
  .parse(process.argv);

