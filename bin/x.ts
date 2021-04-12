#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as moment from 'moment'

import * as anypayx from '../lib/anypayx'

import { BigNumber } from 'bignumber.js'

import { models } from '../lib/models'

import * as fs from 'fs'

import * as path from 'path'

import { Op } from 'sequelize'

import * as csvParse from 'csv-parse';

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
          {id: 'denomination_amount_paid', title: 'Amount Paid'},
          {id: 'cashback_denomination_amount', title: 'Cash Back Paid'},
          {id: 'settlement_amount', title: 'Amount Credited'},
          {id: 'uid', title: 'UID'},
          {id: 'external_id', title: 'OCN'},
        ]
      });

      let records = await csvStringifier.stringifyRecords(invoices.map(invoice => {

        return Object.assign(invoice.toJSON(), {
          denomination_amount_paid: invoice.denomination_amount_paid.toFixed(2),
          settlement_amount: invoice.settlement_amount.toFixed(2),
          cashback_denomination_amount: invoice.cashback_denomination_amount ? invoice.cashback_denomination_amount.toFixed(2) : "0.00",
          paidAt: moment(invoice.paidAt).format('MM/DD/YYYY')
        })

      }))

      let header = await csvStringifier.getHeaderString();
      
      fs.writeFileSync(path.join(__dirname, '../tmp/egifter_ocns.csv'), `${header}\t${records}`)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .command('exportdebits')
  .action(async () => {

    try {

      let email = 'dashsupport@egifter.com'

      let account = await models.Account.findOne({ where: { email }})

      let debits = await models.AnypayxDebit.findAll({
        where: {
          account_id: account.id
        },
        order: [["date", "asc"]],
        include: [{
          model: models.AchBatch,
          as: 'ach_batch'
        }]
      })

      const csvStringifier = createCsvStringifier({
        path: 'egifter_anypayx_debits.csv',
        header: [
          {id: 'date', title: 'Date'},
          {id: 'amount', title: 'Amount'},
          {id: 'settlement_type', title: 'Settlement Type'}
        ]
      });

      let records = await csvStringifier.stringifyRecords(debits.map(debit => {
        let date = moment(debit.date).format('MM/DD/YYYY')
        console.log('date', date)
        return {
          date,
          amount: parseFloat(debit.amount).toFixed(2),
          settlement_type: debit.settlement_type
        }
      }))

      let header = await csvStringifier.getHeaderString();
      
      fs.writeFileSync(path.join(__dirname, '../tmp/egifter_anypayx_debits.csv'), `${header}\t${records}`)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

async function buildReconciliationFromFile(path): Promise<any> {

  let reconciliation = new Reconciliation()

  return new Promise((resolve, reject) => {

    let file = fs.readFileSync(path)

    csvParse(file, async (err, rows) => {

      if (err) {

        return reject(err)

      }

      rows.shift()

      var i = 0;

      for (let row of rows) {

        let entry = new ReconciliationEntry(row)

        if (entry.invoice_uid) {

          reconciliation.stats.total_invoices_with_uid++

        }

        if (entry.correct_ach_batch_id && entry.old_ach_batch_id) {

          if (entry.correct_ach_batch_id == entry.old_ach_batch_id) {

            reconciliation.stats.total_invoices_with_same++

          } else {

            reconciliation.stats.total_invoices_with_different_batch_id++

          }

        }

        if (!entry.correct_ach_batch_id && !entry.old_ach_batch_id) {
          
          reconciliation.stats.total_invoices_with_neither_batch_id++

        }

        reconciliation.entries.push(entry)
        console.log(`invoice uid ${entry.invoice_uid} -- ${++i}`)
        /*

        let invoice = await models.Invoice.findOne({

          where: {

            uid: entry.invoice_uid
              
          }

        })

        if (!invoice.ach_batch_id) {
          reconciliation.invoicesWithoutAchBatchId.push(invoice)
        }
        */

      }

      return resolve(reconciliation)

    })

  })

}

interface ReconciliationStats {
  total_invoices_with_uid: number;
  total_invoices_with_same: number;
  total_invoices_with_different_batch_id: number;
  total_invoices_with_neither_batch_id: number;
}

class Reconciliation {

  entries: ReconciliationEntry[] = [];

  invoicesWithoutAchBatchId: any[] = [];

  stats: ReconciliationStats = {

    total_invoices_with_uid: 0,

    total_invoices_with_same: 0,

    total_invoices_with_different_batch_id: 0,

    total_invoices_with_neither_batch_id: 0

  }

}

class ReconciliationEntry {

  settlement_number: string;
  date_invoice_paid: string;
  paid_amount: string;
  cash_back_paid: string;
  amount_credited: string;
  anypay_invoice_id: string;
  egifter_invoice_id: string;
  settlement_date: string;
  invoice_uid: string;
  correct_ach_batch_id: string;
  old_ach_batch_id: string;

  constructor(row) {

    this.invoice_uid = row[5]

    if (row[11] === '') {

      this.correct_ach_batch_id = null

    } else {

      this.correct_ach_batch_id = row[11]

    }

    if (row[12] === '') {

      this.old_ach_batch_id = null

    } else {

      this.old_ach_batch_id = row[12]

    }

  }
}

program
  .command('comparerange <start> <end>')
  .action(async (start, end) => {

    let batches = await models.AchBatch.findAll({
      where: {
        effective_date: {
          [Op.gte]: start,
          [Op.lt]: end
        }
      }
    })

    for (let batch of batches) {
      try {
        console.log('compare ach', batch.batch_id)
        await compareAch(batch.batch_id)
      } catch(error) {
        console.log(error)
      }
    }

  })

async function compareAch(batch_id) {

    let batch = await models.AchBatch.findOne({
      where: { batch_id }
    })

    let invoices = await models.Invoice.findAll({
      where: { ach_batch_id: batch.id }
    })

    let sumInvoices = invoices.reduce((sum, invoice) => {
      return sum.plus(invoice.denomination_amount_paid).minus(invoice.cashback_denomination_amount)
    }, new BigNumber(0))

    console.log('batch amount', batch.amount)
    console.log('sum invoices amount', sumInvoices.toNumber())

    var difference = sumInvoices.toNumber() - batch.amount

    if (difference > 0) {

      console.log('underpaid by', difference)

    } else if ( difference < 0) {

      console.log('overpaid by', difference)

    } else {

      console.log('correctly paid')

    }

}

program
  .command('compareachstoinvoices <ach_batch_id>')
  .action(async (batch_id) => {

    await compareAch(batch_id)


  })


program
  .command('associateinvoicescsv <path> [skip]')
  .action(async (path, skip=0) => {

    try {

      var i = 0;

      let reconciliation = await buildReconciliationFromFile(path)

      console.log('STATS', reconciliation.stats)
      console.log('INVOICES WITHOUT BATCH ID', reconciliation.invoicesWithoutAchBatchId.length)

      console.log(`${reconciliation.entries.length} ENTRIES`)

      for (let entry of reconciliation.entries) {

        try {
        ++i

        if (entry.correct_ach_batch_id) {

          let achBatch = await models.AchBatch.findOne({

            where: {

              batch_id: entry.correct_ach_batch_id

            }

          })

          if (!achBatch) {
            console.log(`!!!! ach batch not found for batch id ${entry.correct_ach_batch_id}`)

            if (entry.old_ach_batch_id) {

              achBatch = await models.AchBatch.findOne({
                where: {
                  batch_id: entry.old_ach_batch_id
                }
              })

              console.log(`==== old ach batch found with id ${entry.old_ach_batch_id}`)

              if (achBatch) {
                achBatch.batch_id = entry.correct_ach_batch_id 
              }

              await achBatch.save()

            }

          } else {

            console.log(`FOUND ${entry.correct_ach_batch_id} -- ${i}`)
          }

          let invoice = await models.Invoice.findOne({
            where: {
              uid: entry.invoice_uid
            }
          })

          if (invoice && !invoice.ach_batch_id && achBatch) {
            invoice.ach_batch_id = achBatch.id
            await invoice.save()
          }

        }

        } catch(error) {
          console.log(error) 
        }

      }

      process.exit(0)

    } catch(error) {

      console.error(error.message); 

    }


  })

program
  .command('associateinvoice <uid> <batch_id>')
  .action(async (uid, batch_id) => {

    try {

      let invoice = await models.Invoice.findOne({
        where: {
          uid
        }
      })

      let ach_batch = await models.AchBatch.findOne({
        where: {
          batch_id
        }
      })

      if (invoice.ach_batch_id) {
        console.log('batch id', invoice.ach_batch_id)
        console.log('invoice already associated')
      }

      invoice.ach_batch_id = ach_batch.id

      await invoice.save()

      console.log("invoice associated")

    } catch(error) {

      console.error(error.message); 

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

/*
program
  .command('countdebits <account_id>')
  .action(async (account_id) => {

    try {

      let count = await anypayx.countDebits(account_id)

      console.log({ count })

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })
*/

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
  .command('recordachbatch <account_id> <amount> <effective_date> [batch_id]')
  .action(async (account_id, amount, effective_date, batch_id) => {

    try {

      let [batch] = await models.AchBatch.findOrCreate({
        defaults: {
          account_id,
          batch_id,
          amount,
          effective_date
        },
        where: {
          account_id,
          batch_id
        }
      })

      await anypayx.debitACH(batch.id)

    } catch(error) {
      
      console.error(error)
    }

    process.exit(0)

  })

program
  .parse(process.argv)

