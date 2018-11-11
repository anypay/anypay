#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');

import { models, log } from '../lib';

program
  .command('verify <merchant_email>')
  .action(async (email) => {

    log.info('verify merchant', email);

    let account = await models.Account.findOne({ where: { email }});

    let merchant = await models.DashBackMerchant.create({

      account_id: account.id

    });

    console.log(merchant.toJSON());

    process.exit(0);

  });

program.parse(process.argv);

