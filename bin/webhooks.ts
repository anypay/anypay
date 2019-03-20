#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { sendWebhookForInvoice } from '../lib/webhooks';

import * as http from 'superagent';

program
  .command('sendwebhook <invoice_uid>')
  .action(async (invoiceUid) => {

    try {

      let resp = sendWebhookForInvoice(invoiceUid);

      console.log(resp.statusCode, resp.body);

    } catch(error) {

      log.error(error.message);

    }

    process.exit(0);
  
  });

program.parse(process.argv);
