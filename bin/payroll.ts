#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');

import { models, log } from '../lib';

program
  .command('addaccount <email> <base_monthly_amount> <base_currency>')
  .action(async (email, monthlyAmount, currency) => {

    let account = await models.Account.findOne({ where: { email  }});

    let payrollAccount = await models.PayrollAccount.findOne({ where: {

      account_id: account.id

    }});

    if (payrollAccount) {

      log.info('payroll account already exists', email);

      process.exit(1);

    }

    payrollAccount = await models.PayrollAccount.create({

      account_id: account.id,

      base_currency: currency,

      base_monthly_amount: monthlyAmount,

      active: true

    });

    log.info('payroll account created', payrollAccount.toJSON());

    process.exit(0);
  
  });

program.parse(process.argv);

