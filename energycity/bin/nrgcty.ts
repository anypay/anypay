#!/usr/bin/env ts-node

import * as program from 'commander';

import { listCities } from '../lib';

program
  .command('listcities')
  .action(async () => {

    try {

      let result = await listCities();

      console.log(result);

    } catch(error) {
      console.log(error.message);
    }

    process.exit(0);
  
  });

program.parse(process.argv);

