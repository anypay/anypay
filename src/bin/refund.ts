#!/usr/bin/env ts-node
/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
require('dotenv').config();

import { Command } from 'commander';
const program = new Command();

import { getAddressForInvoice, getRefund } from '@/lib/refunds'

import { ensureInvoice } from '@/lib/invoices'

//import { findAccount } from '../lib/account'

program
  .command('getrefund <invoice_uid>')
  .action(async function(uid) {

    try {

      let invoice = await ensureInvoice(uid)

      let result = await getRefund(invoice)

      console.log(result)

    } catch(error) {

      const { message } = error as Error

      console.error("error", message);
    }

  });

program
  .command('listrefunds <account_id>')
  .action(async function(account_id) {

    try {

      throw new Error('not implemented')

    } catch(error) {

      const { message } = error as Error

      console.log("error", message);
    }

  });

program
  .command('getaddress <invoice_uid>')
  .action(async function(uid) {

    try {

      let invoice = await ensureInvoice(uid)

      let result = await getAddressForInvoice(invoice)

      console.log(result)

    } catch(error) {

      const { message } = error as Error

      console.log("error", message);
    }

  });

program.parse(process.argv);

