#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as anypayx from '../lib/anypayx'

program
  .command('settleaccount <account_id>')
  .action(async (account_id) => {

    try {

      let debit = await anypayx.settleAccount(account_id)

      console.log(JSON.stringify({ debit }))

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })

program
  .command('listtransactions <account_id>')
  .action(async (account_id) => {

    try {

      let transactions = await anypayx.listTransactions(account_id)

      console.log(JSON.stringify({ transactions }))

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })

program
  .command('getbalance <account_id>')
  .action(async (account_id) => {

    try {

      let balance = await anypayx.getBalance(account_id)

      console.log({ balance })

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })

program
  .command('creditinvoice <invoice_uid>')
  .action(async (invoice_uid) => {

    try {

      let credit = await anypayx.creditInvoice(invoice_uid)

      console.log(credit)

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })

program
  .parse(process.argv)

