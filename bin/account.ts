#!/usr/bin/env ts-node

require('dotenv').config();

import { models, log } from '../lib';
import { getSupportedCoins } from '../lib/accounts';

var program = require("commander");

program
  .command('listcoins <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    let coins = await getSupportedCoins(account.id); 

    console.log(coins);

  });

program
  .command('getaccount <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {

      log.info(`account not found for email ${email}`);

    } else {

      log.info(`account found`, account.toJSON());

    }

    process.exit();
 
  });

program
  .command('getaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    let accountCoins = await getSupportedCoins(account.id);

    log.info(accountCoins[currency]);

    process.exit(0);

  });

program.parse(process.argv);

