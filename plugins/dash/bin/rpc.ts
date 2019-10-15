#!/usr/bin/env ts-node

require('dotenv').config();

const program = require('commander');

import {rpc} from '../lib/jsonrpc';

const lodash = require('lodash');

program
  .command('listunspent')
  .action(async (address) => {

    try {

      let resp = await rpc.call('listunspent', [0]);

      resp = lodash.filter(resp.result, item => {

        return item.address === address;

      });

      console.log(resp);

    } catch(error) {

      console.log('error', error.message);
    }

    process.exit(0);

  });

program
  .command('listreceivedataddress <address>')
  .action(async (address) => {

    try {

      let resp = await rpc.call('listreceivedbyaddress', [0]);

      resp = lodash.filter(resp.result, item => {

        return item.address === address;

      });

      console.log(resp);

    } catch(error) {

      console.log('error', error.message);
    }

    process.exit(0);

  });

program
  .command('dumpprivkey <address>')
  .action(async (address) => {

    try {

      let resp = await rpc.call('dumpprivkey', [address]);

      console.log(resp);

    } catch(error) {

      console.log('error', error.message);
    }

    process.exit(0);

  });

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

