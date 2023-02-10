#!/usr/bin/env ts-node

require('dotenv').config();

import { Command } from 'commander';
const program = new Command();

import { getAddressForInvoice, getRefund } from '../lib/refunds'

import { ensureInvoice } from '../lib/invoices'

//import { findAccount } from '../lib/account'

program
  .command('getrefund <invoice_uid>')
  .action(async function(uid) {

    try {

      let invoice = await ensureInvoice(uid)

      let result = await getRefund(invoice)

      console.log(result)

    } catch(e) {

      console.log("error", e.message);
    }

  });

program
  .command('listrefunds <account_id>')
  .action(async function(account_id) {

    try {


      throw new Error('not implemented')
      //let account = await findAccount(account_id)
      //let refunds = await account.listRefunds()

      /*for (let refund of refunds) {

        console.log(refund)

      }
      */

    } catch(e) {

      console.log("error", e.message);
    }

  });

program
  .command('getaddress <invoice_uid>')
  .action(async function(uid) {

    try {

      let invoice = await ensureInvoice(uid)

      let result = await getAddressForInvoice(invoice)

      console.log(result)

    } catch(e) {

      console.log("error", e.message);
    }

  });

program.parse(process.argv);

