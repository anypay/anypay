#!/usr/bin/env ts-node

import * as program from 'commander';

import { rpc, sendAUG } from '../lib/rvn';

program
  .command('getnewaddress')
  .action(async () => {

    let result = await rpc('getnewaddress', []);

    console.log(result);

  });

program
  .command('transfer <amount> <address>')
  .action(async (amount, address) => {

    let result = await sendAUG(parseFloat(amount), address);

    console.log(result);

  });

  

program.parse(process.argv);
