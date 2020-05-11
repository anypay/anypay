#!/usr/bin/env ts-node

import * as program from 'commander';
import { ambassadorRewardEmail } from '../lib/email';

program
  .command('ambassador_reward <invoice_uid>')
  .action(async (invoice_uid) => {

    try {

      let resp = await ambassadorRewardEmail(invoice_uid)

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program.parse(process.argv);

