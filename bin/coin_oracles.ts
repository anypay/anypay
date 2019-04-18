#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { createCoinOracle, deleteCoinOracle } from '../lib/coin_oracles';

program
  .command('create <coin>')
  .action(async (coin) => {

    let resp = await createCoinOracle(coin);

    console.log(resp);

    process.exit(0);
  
  });

program
  .command('delete <coin>')
  .action(async (coin) => {

    await deleteCoinOracle(coin);  

    process.exit(0);
  
  });


program.parse(process.argv);
