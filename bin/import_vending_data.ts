#!/usr/bin/env ts-node

require('dotenv').config(); 

import * as commander from 'commander';

import { importVendingCsv } from '../lib/vending-machine/read_csv_and_insert_to_database';

commander
  .command('import <path>')
  .action(async (path) => {

    importVendingCsv(path);

    console.log('done');

    process.exit(0);

  });

commander.parse(process.argv);
