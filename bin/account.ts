#!/usr/bin/env ts-node

require('dotenv').config();

import { models } from '../lib';
import { getSupportedCoins } from '../lib/accounts';

var program = require("commander");

program
  .command('listcoins <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email }});

    let coins = await getSupportedCoins(account.id); 

    console.log(coins);

  });

program.parse(process.argv);

