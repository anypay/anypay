#!/usr/bin/env ts-node

import * as program from 'commander';

import { models, log } from '../lib';

program
  .command('create <email> <input_currency> <output_currency> <output_address> [router_name]')
  .action(async (email, input_currency, output_currency, output_address, router_name) => {

    let account = await models.Account.findOne({ where: { email } });

    let route = await models.AccountRoute.findOne({ where: {

      account_id: account.id,

      input_currency,

      output_currency

    }});

    if (route) {

      log.error(`account route exists for ${input_currency}`);

      process.exit(1);

    }

    
    route = await models.AccountRoute.create({

      account_id: account.id,

      input_currency,

      output_currency,

      output_address,

      router_name

    });

    log.info('accountroute.created', route.toJSON());

    process.exit(0);

  });

program.parse(process.argv);
