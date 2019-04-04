#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { rippleLib_checkAddressForPayments } from '../lib/ripple_restAPI';

import { awaitChannel } from '../../../lib/amqp';

program
  .command('checkaddressforpayment <address> [tag]')
  .action(async (address, tag) => {

    let channel = await awaitChannel();

    let resp = await rippleLib_checkAddressForPayments(address, tag);

    console.log("resp", resp);

    let message = new Buffer(JSON.stringify(resp));

    channel.publish('anypay.payments', 'payment', message);

    console.log(resp);

  });

program.parse(process.argv);

