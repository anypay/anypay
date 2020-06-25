#!/usr/bin/env ts-node

import * as program from 'commander';
import { readFileSync } from 'fs';

import { createPaymentRequestFromCsv } from '../lib/csv_payment_requests';

program
  .command('create <csv_file_path>')
  .action(async (filepath) => {

    try {

      let csv = readFileSync(filepath).toString();

      let request = await createPaymentRequestFromCsv(csv);

      console.log(request);

    } catch(error) {

      console.error(error);

    }

    process.exit(0);

  });

program
  .parse(process.argv);
