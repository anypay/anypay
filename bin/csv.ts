#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { buildAccountCsvReport } from '../lib/csv'

import { findAccount } from '../lib/account'

program
  .command('payments <account_id>')
  .action(async (account_id) => {

    try {

      let account = await findAccount(account_id)

      let report = await buildAccountCsvReport(account)

      console.log(report)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })
   

program.parse(process.argv)

