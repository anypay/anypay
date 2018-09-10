#!/usr/bin/env ts-node

import * as program from 'commander';

import {sweepUnpaid} from '../lib/core';

program
  .command('checkunpaid')
  .action(async () => {

    await sweepUnpaid();

    process.exit(0);

  });

program
  .parse(process.argv);

