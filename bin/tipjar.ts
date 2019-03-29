#!/usr/bin/env ts-node

require('dotenv').config();

let tipjarProgram = require('commander');

import { tipjar, models, log } from '../lib';

tipjarProgram
  .command('gettipjar <email> <currency>')
  .action(async (email, currency = 'BCH') => {

    let account = await models.Account.findOne({ where: { email }});

    console.log('account', account.toJSON());

    let tipJar = await tipjar.getTipJar(parseInt(account.id), currency);

    console.log(tipJar.toJSON());

    process.exit(0);

  });

tipjarProgram
  .command('gettipjarandbalance <email> <currency>')
  .action(async (email, currency = 'BCH') => {

    let account = await models.Account.findOne({ where: { email }});

    console.log('account', account.toJSON());

    let result = await tipjar.getTipJarAndBalance(parseInt(account.id), currency);

    console.log(result);

    process.exit(0);

  });

tipjarProgram
  .command('getbalance <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    console.log('account', account.toJSON());

    let tipJar = await tipjar.getTipJar(parseInt(account.id), currency);

    let balance = await tipjar.getTipJarBalance(tipJar);

    console.log(`balance: ${balance}`);

    process.exit(0);

  });

tipjarProgram.parse(process.argv);

