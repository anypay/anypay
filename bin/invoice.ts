#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { generateInvoice } from '../lib/invoice';

import { log, models } from '../lib';

program
  .command('generate <email> <currency> <denomonation_amount>')
  .action(async (email, currency, amount) => {

    let account = await models.Account.findOne({ where: { email }});

    let invoice = await generateInvoice(account.id, amount, currency);

    log.info(invoice.toJSON());

    process.exit(0);

  });

program.parse(process.argv);

