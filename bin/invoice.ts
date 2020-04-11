#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { generateInvoice } from '../lib/invoice';

import { log, models } from '../lib';

import { invoicePaidEmail } from '../lib/email';

import { email } from 'rabbi';

program
  .command('generate <email> <denomination_amount> <currency>')
  .action(async (email, denominationAmount, currency) => {

    var amount = parseFloat(denominationAmount);

    let account = await models.Account.findOne({ where: { email }});

    let invoice = await generateInvoice(account.id, amount, currency);

    console.log('invoice generate', invoice.uid);
    console.log('payment options', invoice.payment_options.length);

    process.exit(0);

  });

program
  .command('sendemailreceipt <invoice_uid>')
  .action(async (uid) => {

    try {

      let invoice = await models.Invoice.findOne({ where: {
        uid
      }});

      let resp = await invoicePaidEmail(invoice);

    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  });

program.parse(process.argv);

