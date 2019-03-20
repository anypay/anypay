#!/usr/bin/env ts-node

require('dotenv').config(); 

import * as commander from 'commander';

import * as prompt from 'prompt-async';

import { models } from '../lib';

import * as Table from 'cli-table2';

commander
  .command('setbankaccount')
  .action(async () => {

    const { email } = await prompt.get(['email']); 

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {

      throw new Error(`account not found for ${email}`);

    }

    let bankAccount = await models.BankAccount.findOne({ where: {

      account_id: account.id

    }});

    if (bankAccount) {

      throw new Error(`bank account already set for ${email}`);

    }

    let bankAccountParams = await prompt.get([
      'beneficiary_name',
      'beneficiary_address',
      'city',
      'state',
      'zip',
      'routing_number',
      'beneficiary_account_number'
    ]);

    bankAccountParams.account_id = account.id

    let record = await models.BankAccount.create(bankAccountParams);

    console.log('bank account created', record.toJSON());

    process.exit(0);

  });

commander
  .command('listbankaccounts')
  .action(async () => {

    let bankAccounts = await models.BankAccount.findAll(); 

    // instantiate
    var table = new Table({
        head: [
          'Account ID',
          'Beneficiary Name',
          'Beneficiary Address',
          'City',
          'State',
          'Zip',
          'Routing Number',
          'Bank Account Number'
        ]
    });

    bankAccounts.forEach(account => {

      table.push([
        account.id,
        account.beneficiary_name,
        account.beneficiary_address,
        account.city,
        account.state,
        account.zip,
        account.routing_number,
        account.beneficiary_account_number
      ])

    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends

    console.log(table.toString());

  });

commander.parse(process.argv);

