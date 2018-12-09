#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander');

import {rpc} from '../lib/jsonrpc';

program
  .command('getbalance')
  .action(async (address) => {

    try {

      let resp = await rpc.call('getbalance', []);

      console.log('balance', resp);

    } catch(error) {

      console.log('error', error.message);
    }

    process.exit(0);

  });

program
  .command('getnewaddress')
  .action(async (address) => {

    try {

      let resp = await rpc.call('getnewaddress', []);

      console.log('address', resp);

    } catch(error) {

      console.log('error', error.message);
    }

    process.exit(0);

  });

program.parse(process.argv);

