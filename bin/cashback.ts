#!/usr/bin/env ts-node

require('dotenv').config();

let program = require('commander');

import { log, cashback } from '../lib';

program
  .command('getambassadoraddressforinvoice <invoice_uid>')
  .action(async (invoiceUID) => {

    let address = await cashback.getAmbassadorAddressForInvoice(invoiceUID);

    log.info(address);


  });

program.parse(process.argv);

