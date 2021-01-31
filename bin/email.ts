#!/usr/bin/env ts-node

import * as program from 'commander';
import { ambassadorRewardEmail } from '../lib/email';
import { sendEgifterAchReceipt } from '../lib/ach';
import { models } from '../lib/models';
import { email as rabbiEmail } from 'rabbi';

program
  .command('ambassador_reward <invoice_uid>')
  .action(async (invoice_uid) => {

    try {

      let resp = await ambassadorRewardEmail(invoice_uid)

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('welcome <email_address>')
  .action(async (email) => {

    try {

      let resp = await rabbiEmail.sendEmail('welcome', email, 'derrick@anypayinc.com', {
        email 
      })

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('first_invoice_created <email_address>')
  .action(async (email) => {

    try {

      let resp = await rabbiEmail.sendEmail('first_invoice_created', email, 'derrick@anypayinc.com', {
        email 
      })

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('invoice_paid_receipt <uid>')
  .action(async (uid) => {

    let invoice = await models.Invoice.findOne({ where: { uid }})
    let account = await models.Account.findOne({ where: { id: invoice.account_id }})

    try {

      let resp = await rabbiEmail.sendEmail('invoice_paid_receipt', account.email, 'derrick@anypayinc.com', {
        invoice,
        account,
        email: account.email
      })

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  })


program
  .command('egifter_settlement <ach_batch_id> <email>')
  .action(async (ach_batch_id, email) => {

    try {

      let resp = await sendEgifterAchReceipt(ach_batch_id, email);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program.parse(process.argv);

