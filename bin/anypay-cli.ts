#!/usr/bin/env ts-node

require('dotenv').config();
const program = require('commander');
const Account = require('../lib/models/account');
const InvoiceService = require('../lib/invoice_service');
const prettyjson = require('prettyjson');

import { log, models } from '../lib';

async function ensureAccountFromEmail(email: string): Promise<any> {

  let account = await models.Account.findOne({ where: { email }});

  if (!account) {

    throw new Error(`account ${email} not found`);

  }

  return account;

}

program
  .option('-a --account <account_id>', 'account for which to generate invoice');

program
  .command('createsimplewallet')
  .option('--name <name>')
  .option('--currency <currency>')
  .option('--address <address>')
  .action(async (options) => {

    let wallet = await models.SimpleWallet.create({

      name: options.name,

      currency: options.currency,

      address: options.address

    });

    log.info('simplewallet.created', wallet.toJSON());

  });

program
  .command('setaddressroute <email>')
  .option('--inputcurrency <currency>')
  .option('--inputaddress <address>')
  .option('--outputcurrency <currency>')
  .option('--outputaddress <address>')
  .action(async (email, options) => {

    let account = await ensureAccountFromEmail(email);

    log.info('setaddressroute', options.inputcurrency); 

    let route = await models.AddressRoute.findOne({ where: {

      input_currency: options.inputcurrency,

      input_address: options.inputaddress

    }});

    if (route) {

      throw new Error('route already exists');

    }

    route = await models.AddressRoute.create({

      account_id: account.id,

      input_currency: options.inputcurrency,

      input_address: options.inputaddress,

      output_currency: options.outputcurrency,

      output_address: options.outputaddress

    });
  
    log.info('route created', route.toJSON());

  });


program
  .description('generate invoice such as "createinvoice 10 USD BCH"')
  .command('createinvoice <denomition_amount> <denomination> <currency>')
  .option('-a --account_id <account_id>', 'account for which to generate invoice')
  .action(async(denominationAmount, denomination, currency, options) => {

    if (!options.account_id) {
      console.error('account_id option required');
      process.exit(1);
    }

    var account = await Account.findOne({ where: { id: options.account_id }})

    if (!account) {
      console.error(`account with id ${options.account_id} not found`);
      process.exit(1);
    }

    try {
      let invoice = await InvoiceService.generate({
        denomination: denomination,
        amount: denominationAmount,
        currency: currency,
      	account_id: options.account_id
      })

      console.log('invoice generated');
      console.log(prettyjson.render(invoice.toJSON(), {noColor:false}));

    } catch(error) {
      console.error('error generating invoice', error.message)
      process.exit(1);
    }

    process.exit(0);
  });

program.parse(process.argv);

