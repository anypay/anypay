#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { withdrawStatus, withdrawInfo, getAccountBalance, listTrades, listOpenOrders, listBankAccounts } from '../lib/kraken';
import * as kraken from '../lib/kraken';
import { models } from '../lib/models';
import { database } from '../lib';

program
  .command('withdrawinfo')
  .action(async () => {

    try {

      let response = await withdrawInfo();

      console.log(response.result);
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);


  })

program
  .command('withdraw')
  .action(async () => {

    try {

      let result = await kraken.withdrawAllUSD()

      console.log(result)
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);


  })

program
  .command('withdrawstatus')
  .action(async () => {

    try {

      let response = await withdrawStatus();

      console.log(response.result);
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);


  })

program
  .command('accountbalance')
  .action(async () => {

    try {

      let response = await getAccountBalance();

      console.log(response.result);
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);


  })

program
  .command('listtrades')
  .action(async () => {

    try {

      let response = await listTrades();

      console.log(response.result.trades);
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  })

program
  .command('listopenorders')
  .action(async () => {

    try {

      let response = await listOpenOrders();

      console.log(response.result);
  
    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  })



program
  .command('synctrades')
  .action(async () => {

    try {

      await kraken.syncAllNewTrades();

    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  })



program.parse(process.argv);

