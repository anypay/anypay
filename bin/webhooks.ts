#!/usr/bin/env ts-node

require('dotenv').config();

import { Command } from 'commander';
const program = new Command();

import { sendWebhookForInvoice } from '../lib/webhooks';

program
  .command('sendwebhook <invoice_uid>')
  .action(async (invoiceUid) => {

    try {

      let resp:any = await sendWebhookForInvoice(invoiceUid);

      console.log(resp);

      console.log(resp.statusCode, resp.body);

    } catch(error) {

      console.log('error', error);

    }

    process.exit(0);
  
  });

program.parse(process.argv);

