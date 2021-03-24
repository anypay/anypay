#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as anypayx from '../lib/anypayx'

import { models } from '../lib/models'

program
  .command('debitallbitpaysettlements')
  .action(async () => {

    let settlements = await models.BitpaySettlement.findAll()

    for (let settlement of settlements) {

      await anypayx.debitBitpaySettlement(settlement)

    }

  })

program
  .command('debitallach <start_date> [end_date]')
  .action(async (start_date, end_date) => {

    await anypayx.debitAllACH(start_date, end_date)


  })

program
  .command('creditallinvoices <account_email>')
  .action(async (email) => {
    
    let account = await models.Account.findOne({ where: { email }})

    await anypayx.creditAllInvoices(account.id)

  })


program
  .command('debitach <ach_batch_id>')
  .action(async (ach_batch_id) => {

    try {

      let debit = await anypayx.debitSettlement({
        settlement_type: 'ach_batch',
        settlement_id: ach_batch_id
      })

      console.log('debit', debit.toJSON())

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

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

