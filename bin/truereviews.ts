#!/usr/bin/env ts-node

import * as program from 'commander';

import { generateCodeForInvoice } from '../lib/truereviews';

program
  .command('generatecode <invoice_uid>')
  .action(async (invoice_uid) => {

    try {

      let resp = await generateCodeForInvoice(invoice_uid);

      console.log(resp);

    } catch(error) {

      console.log(error)

    }


    process.exit(0);

  });


program.parse(process.argv);
