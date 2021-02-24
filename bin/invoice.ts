#!/usr/bin/env ts-node

require('dotenv').config(); 
import * as program from 'commander';

import { generateInvoice } from '../lib/invoice';

import { coins, log, models, invoices } from '../lib';

import { invoicePaidEmail } from '../lib/email';

import { email } from 'rabbi';

program
  .command('generate <email> <denomination_amount> <currency>')
  .action(async (email, denominationAmount, currency) => {

    var amount = parseFloat(denominationAmount);

    let account = await models.Account.findOne({ where: { email }});

    let invoice = await generateInvoice(account.id, amount, currency);

    log.info('invoice.generated', invoice.toJSON());

    process.exit(0);

  });

program
  .command('refresh <invoice_uid>')
  .action(async (uid) => {

    try {

      await coins.refreshCoins()

      await invoices.refreshInvoice(uid)

    } catch(error) {

      console.log(error)
      log.error(error)

    }

    process.exit(0);

  })

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

