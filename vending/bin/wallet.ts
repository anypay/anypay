#!/usr/bin/env ts-node
import * as program from 'commander';

import { sendtoaddress } from '../lib/wallet';

program
  .command('sendtoaddress <address> <amount>')
  .action(async (address, amount) => {

    sendtoaddress(address, parseFloat(amount))
      .then(result => {
        console.log('sent!', result);
        process.exit(0);
      })
      .catch(error => {

        console.error('error', error.message)
        process.exit(0);
      })
  });

program
  .parse(process.argv);
