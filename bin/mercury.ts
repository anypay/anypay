#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as mercury from '../lib/mercury'

program
  .command('listaccounts')
  .action(async () => {

    try {

      let accounts = await mercury.listAccounts()

      console.log(accounts)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('getachaccount')
  .action(async () => {

    try {

      let account = await mercury.getAccount(process.env['MERCURY_ACH_ACCOUNT_ID'])

      console.log(account)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('sendach <recipientid> <amount> <externalMemo>')
  .action(async (recipientid, amount, externalMemo) => {

    try {

      let transaction = await mercury.sendACH(recipientid, amount, externalMemo)

      console.log(transaction)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('sendachforbatch <batch_id>')
  .action(async (batchId) => {

    try {

      let transaction = await mercury.sendACHForBatch(batchId)

      console.log(transaction)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('listtransactions')
  .action(async () => {

    try {

      let transactions = await mercury.listTransactions(process.env['MERCURY_ACH_ACCOUNT_ID'])

      console.log(transactions)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('listrecipients')
  .action(async () => {

    try {

      let recipients = await mercury.listRecipients()

      console.log(recipients)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program.parse(process.argv)

