#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import * as generalbytes from '../lib/generalbytes';

program
  .command('importcsv <path>')
  .action(async (path) => {

    let csv = await generalbytes.getCSVFromPath(path) 

    let newRecords = await generalbytes.importCSV(csv);

    console.log(newRecords.map(r => r.toJSON()));

    process.exit(0);

  })

program.parse(process.argv);

