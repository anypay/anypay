#!/usr/bin/env ts-node

require('dotenv').config(); 
import * as program from 'commander';

import { createInvoice } from '../lib/invoices';

import { coins, log, models, invoices } from '../lib';

import { invoicePaidEmail } from '../lib/email';

import { listInvoiceEvents } from '../lib/events'

import { ensureInvoice } from '../lib/invoices'

program
  .command('generate <email> <denomination_amount> <currency>')
  .action(async (email, denominationAmount, currency) => {

    try {

      var amount = parseFloat(denominationAmount);

      console.log('generate invoice', {email, denominationAmount, currency })

      let account = await models.Account.findOne({ where: { email }});

      console.log('account', account.toJSON())

      let invoice = await createInvoice({account, amount, currency});

      log.info('invoice.generated', invoice.toJSON());

    } catch(error) {

      log.error(error);

    }

    process.exit(0);

  });

program
  .command('events <invoice_uid>')
  .action(async (invoice_uid) => {

    try {
      
      let invoice = await ensureInvoice(invoice_uid)

      let events = await listInvoiceEvents(invoice)

      for (let event of events) {

        console.log(event.toJSON())

      }

    } catch(error) {

      console.log(error)

      log.error(error);

    }

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

      await invoicePaidEmail(invoice);

    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  });

program
  .command('info <invoice_uid>')
  .action(async (uid) => {

    try {

      let invoice = await models.Invoice.findOne({
        where: {
          uid
        },
        include: [{
          model: models.Payment,
          as: 'payment'
        }, {
          model: models.Refund,
          as: 'refund'
        }]
      });

      console.log(invoice.toJSON())

    } catch(error) {

      console.log(error);
    }

    process.exit(0);

  });

program.parse(process.argv);

