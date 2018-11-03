#!/usr/bin/env ts-node

require('dotenv').config();

var program = require('commander');

import { models, log, prices } from '../lib';

import { getSupportedCoins } from '../lib/accounts';

import { sendPayrollReceipt } from '../lib/payroll/email';

import * as bch from '../plugins/bch';

program
  .command('listaccounts')
  .action(async () => {

    let payrollAccounts = await models.PayrollAccount.findAll();

    payrollAccounts.map((account) => log.info(account.toJSON()));

    process.exit(0);

  });

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

    if (!account) {

      log.error(`no account found with email ${email}`);

      process.exit(0);

    }

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
      payroll_account_id: payrollAccount.id,
      amount,
      address,
      currency,
      hash: result.result,
    });

    log.info('payroll payment', payrollPayment.toJSON());

    let emailResult = await sendPayrollReceipt(payrollPayment.id);

    log.info('payroll email receipt sent!')

  });

program
  .command('sendemailreceipt <email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: { email  }});

    if (!account) {

      log.error(`no account found with email ${email}`);

      process.exit(0);

    }

    let payrollAccount = await models.PayrollAccount.findOne({ where: {

      account_id: account.id

    }});

    let latestPayrollPayment = await models.PayrollPayment.findOne({

      where: { payroll_account_id: payrollAccount.id }

    });

    log.info('latestpayrollpayment', latestPayrollPayment.toJSON());

    try {

      let emailResult = await sendPayrollReceipt(latestPayrollPayment.id);
      
      console.log(`email sent ${emailResult}`);

    } catch(error) {

      log.error(error.message);

    }

    process.exit(0);

  });


program.parse(process.argv);

