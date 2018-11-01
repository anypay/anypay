#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');

import { models, log, prices } from '../lib';

import { getSupportedCoins } from '../lib/accounts';

import * as bch from '../plugins/bch';

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

program
  .command('pay <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    let payrollAccount = await models.PayrollAccount.findOne({ where: {

      account_id: account.id

    }});

    let conversion = await prices.convert({

      currency: payrollAccount.base_currency,

      value: payrollAccount.base_monthly_amount

    }, currency);

    let amount = conversion.value  / 2; // two week pay period

    log.info('conversion', conversion);

    let address = (await getSupportedCoins(account.id))['BCH'].address;

    log.info('send payment', { address, amount });

    let result = await bch.rpc.call('sendtoaddress', [address, amount.toString()]);

    log.info('rpc result', result);

    let payrollPayment = await models.PayrollPayment.create({
      payroll_account_id: payrollAccount.id
      amount: amount,
      address: address,
      hash: result.result
    });

  });

program.parse(process.argv);

