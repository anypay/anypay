#!/usr/bin/env ts-node
import * as program from 'commander';

import { sendtoaddress, rpc_sendtoaddress, rpc_getbalance } from '../lib/wallet';

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
  .command('rpc_sendtoaddress <address> <amount>')
  .action(async (address, amount) => {

    rpc_sendtoaddress(address, parseFloat(amount))
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
  .command('rpc_getbalance')
  .action(async (address, amount) => {

    rpc_getbalance()
      .then(result => {
        console.log('balance', result);
        process.exit(0);
      })
      .catch(error => {

        console.error('error', error.message)
        process.exit(0);
      })
  });



program
  .parse(process.argv);
