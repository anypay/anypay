#!/usr/bin/env ts-node

import * as program from 'commander';

import { rippleLib_checkAddressForPayments } from '../lib/ripple_restAPI';

program
  .command('checkaddressforpayment <address> [tag]')
  .action(async (address, tag) => {

    let resp = await rippleLib_checkAddressForPayments(address);

    console.log(resp);

  });

program.parse(process.argv);

