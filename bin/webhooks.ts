#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { models, log } from '../lib';

import * as http from 'superagent';

program
  .command('sendwebhook <invoice_uid>')
  .action(async (invoiceUid) => {

    let invoice = await models.Invoice.findOne({ where: {
      uid: invoiceUid
    }});

    console.log('found invoice');

    if (invoice.webhook_url) {

      console.log(invoice.webhook_url);

      let json = invoice.toJSON();

      let resp = await http.post(invoice.webhook_url).send(json);

      console.log(resp.statusCode, resp.body);

    } else {

      log.error('no webhook_url set for invoice');

    }

    process.exit(0);
  
  });

program.parse(process.argv);
