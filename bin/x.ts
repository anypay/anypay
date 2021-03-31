#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as moment from 'moment'

import * as anypayx from '../lib/anypayx'

import { models } from '../lib/models'

import * as fs from 'fs'

import * as path from 'path'

import { Op } from 'sequelize'

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

program
  .command('exportocns')
  .action(async () => {

    try {

      let email = 'dashsupport@egifter.com'

      let account = await models.Account.findOne({ where: { email }})

      let invoices = await models.Invoice.findAll({
        where: {
          status: {
            [Op.in]: ["paid", "underpaid", "overpaid"]
          },
          account_id: account.id
        },
        order: [["paidAt", "asc"]]
      })

      const csvStringifier = createCsvStringifier({
        path: 'ocns.csv',
        header: [
          {id: 'paidAt', title: 'Paid at'},
          {id: 'denomination_amount_paid', title: 'Amount USD'},
          {id: 'uid', title: 'UID'},
          {id: 'external_id', title: 'OCN'},
        ]
      });

      let records = await csvStringifier.stringifyRecords(invoices.map(invoice => {

        return Object.assign(invoice.toJSON(), {
          paidAt: moment(invoice.paidAt).format('MM/DD/YYYY')
        })

      }))
      
      fs.writeFileSync(path.join(__dirname, '../tmp/egifter_ocs.csv'), records)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })



program
  .command('monthlyreport <email> <month_year>')
  .action(async () => {

    // dashsupport@egifter.com 01_2021 

  })

program
  .command('allstatements <email> [include_transactions]')
  .action(async (email, include_transactions=true) => {

    console.log('monthlyreports', email)

    try {

      let account = await models.Account.findOne({ where: { email }})

      let statements = await anypayx.allStatements({
        account_id: account.id,
        include_transactions
      })

      console.log(statements)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })


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

