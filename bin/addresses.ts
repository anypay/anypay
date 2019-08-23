#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { models, addresses, plugins } from '../lib';

import * as bch from 'bitcore-lib-cash';
import * as dash from 'bitcore-lib-dash';
import * as bsv from 'bsv';

program
  .command('setstaticaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: { email }});

    if (!account) {
      console.error(`account not found`);
      process.exit(0);
    }

    let accountAddress = await models.Address.findOne({ where: {
      account_id: account.id,
      currency
    }});

    if (!accountAddress) {
      console.error(`account address not found`);
      process.exit(0);
    }

    let privkey = new bch.PrivateKey();

    let inputAddress = privkey.toAddress().toString();

    let rpc = plugins.getRPC(currency);

    if (rpc) {

      let resp = await rpc.call('importaddress', [inputAddress, 'false', false])

      console.log(resp);
      
    }

    let staticAddressRoute = await models.StaticAddressRoute.findOne({ where: {
      account_id: account.id,
      input_currency: currency
    }});

    if (staticAddressRoute) {

      console.error('static address already set');

      process.exit(0);

    } else {

      let route = await models.StaticAddressRoute.create({
        account_id: account.id,
        input_address: inputAddress,
        input_currency: currency,
        private_key_wif: privkey.toWIF()
      });

      console.log(route.toJSON());

    }

    process.exit(0);

  });

program
  .command('lockaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: {

      email

    }});

    if (!account) {

      console.log(`account ${email} not found`);

      process.exit();

    }

    await addresses.lockAddress(account.id, currency);
      
    process.exit()

  });

program
  .command('unlockaddress <email> <currency>')
  .action(async (email, currency) => {

    let account = await models.Account.findOne({ where: {

      email

    }});

    if (!account) {

      console.log(`account ${email} not found`);

      process.exit();

    }

    await addresses.unlockAddress(account.id, currency);

  });

program.parse(process.argv);
