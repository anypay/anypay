#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');

import {log, models} from '../lib';

import * as xpublib from '../lib/xpub/index';

program
  .command('randomxpub <currency>')
  .action(async (currency) => {

    let xpub = xpublib.randomXpubKey(currency);

    console.log(xpub);

    process.exit(0);

  });

program
  .command('generateaddress <currency> <xpubkey> <nonce>')
  .action(async (currency, xpubkey, nonce) => {

    let address = xpublib.generateAddress(currency, xpubkey, nonce);

    console.log(address);

    process.exit(0);

  });

program.parse(process.argv);

