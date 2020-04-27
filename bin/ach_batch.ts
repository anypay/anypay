#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';
import * as assert from 'assert';

import { models, log, database } from '../lib';
import * as ach from '../lib/ach';
import * as wire from '../lib/wire';
import { sendEmail } from '../lib/email';

import * as moment from 'moment';

import { BigNumber } from 'bignumber.js';

import * as fs from 'fs';

import { join } from 'path';
import { Op } from 'sequelize';

import * as csvParse from 'csv-parse';

import { importInvoiceRangeForAchBatch } from '../lib/ach';

const _cliProgress = require('cli-progress');

async function findAchBatch(batch: AchBatch) {

  return models.AchBatch.findOne({ where: { batch_id: batch.batch_id }});

}

interface AchBatch {
  batch_id: number;
  effective_date: Date;
  type: string;
  batch_description: string;
  originating_account: string;
  first_invoice_uid: string;
  last_invoice_uid: string;
  amount: number;
  currency: number;
}

async function recordAchBatch(batch: AchBatch) {

  return models.AchBatch.create(batch);

}

async function findAccount(email: string) {

  return models.Account.findOne({ where: { email }});

}

async function findOrRecordAchBatch(batch: AchBatch) {

  var record = await findAchBatch(batch);

  if (!record) {

    record = await recordAchBatch(batch);

  }

  return record

}

async function updateAchBatch(batch: AchBatch) {

  var record = await findAchBatch(batch);

  if (!record) {

    record = await recordAchBatch(batch);

  }

  return record

}

function csvToBatches(path): Promise<AchBatch[]> {

  return new Promise((resolve, reject) => {

    let file = fs.readFileSync(path);

    csvParse(file.toString(), (err, output) => {

      // remove header row
      output.shift();

      if (err) { return reject(err) }

      resolve(output.map(row => {

        return {
          batch_id: row[0],
          effective_date: row[1],
          type: row[2],
          batch_description: row[3],
          originating_account: row[4],
          amount: parseFloat(row[5].replace('$', '')),
          first_invoice_uid: row[6],
          last_invoice_uid: row[7],
          currency: 'USD'
        }

      }));
    
    })

  });

}

program
  .command('importcsv <path>')
  .action(async (path) => {

    if (!path.match(/^\//)) {
      path = join(process.cwd(), path);
    }

    // load and parse the csv
    let batches = await csvToBatches(path);

    // import any new records
    for (let i=0; i < batches.length; i++) {

      console.log('batch', batches[i]);

      await findOrRecordAchBatch(batches[i]);

    }

  
  });

program
  .command('addaccountachinvoice <email> <batchid> <invoiceuid>')
  .action(async (email, batchid, invoiceuid) => {

    let account = await models.Account.findOne({ where: {
      email
    }});

    let batch = await models.AchBatch.findOne({ where: {
      batch_id: batchid
    }});

    let ach = await models.AccountAch.findOne({ where: {
      ach_batch_id: batch.id,
      account_id: account.id
    }});

    let record = await models.AccountAchInvoice.create({
      invoice_uid: invoiceuid,
      account_ach_id: ach.id
    });

    console.log(record.toJSON());

    process.exit();
  
  });

program
  .command('importaccountcsv <email> <path>')
  .action(async (email, path) => {

    if (!path.match(/^\//)) {
      path = join(process.cwd(), path);
    }

    // load and parse the csv
    let batches = await csvToBatches(path);

    let account = await findAccount(email);

    // import any new records
    for (let i=0; i < batches.length; i++) {

      let batch = await findAchBatch(batches[i]);

      await models.AccountAch.create({
        ach_batch_id: batch.id,
        account_id: account.id,
        first_invoice_uid: batches[i].first_invoice_uid,
        last_invoice_uid: batches[i].last_invoice_uid
      });

    }

  
  });

program
  .command('getinvoicerange <account_ach_id>')
  .action(async (accountAchId) => {

    try {

      let accountAch = await models.AccountAch.findOne({ where: {

        id: parseInt(accountAchId)

      }});

      let invoices = await ach.getInvoiceRange(
        accountAch.first_invoice_uid,
        accountAch.last_invoice_uid,
        {
          account_id: accountAch.account_id 
        }
      );

      invoices.forEach(invoice => {

        console.log({

          uid: invoice.uid,

          amount: invoice.denomination_amount,

          cashback: invoice.cashback_denomination_amount || 0

        });

      });

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('importinvoicerange <account_ach_id>')
  .action(async (accountAchId) => {

    try {

      let newRecords = await importInvoiceRangeForAchBatch(accountAchId);

      newRecords.map(r => console.log(r.toJSON()));

      console.log(`imported ${newRecords.length} new records`);

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('importaccountachinvoices <email>')
  .action(async (email) => {

    const bar1 = new _cliProgress.SingleBar({}, _cliProgress.Presets.shades_classic);

    try {

      let account = await models.Account.findOne({ where: { email }});

      let accountAchs = await models.AccountAch.findAll({ where: {

        account_id: account.id

      }});

      console.log(`Importing ${accountAchs.length} ACH Batches`);

      bar1.start(accountAchs.length, 0);

      for (let i=0; i < accountAchs.length; i++) {

        try {

          let newRecords = await importInvoiceRangeForAchBatch(accountAchs[i].id);

          newRecords.map(r => console.log(r.toJSON()));

        } catch(error) {

          //console.error(error.message);

        }

        bar1.update(i);

      }

    } catch(error) {

      //console.error(error.message);

    }

    bar1.stop();

    process.exit(0);

  });

program
  .command('copyachbatchdata')
  .action(async () => {

    let batches = await models.AchBatch.findAll();

    let account1 = await models.Account.findOne({ where: {

      email: 'dashsupport@egifter.com'

    }});

    let account2 = await models.Account.findOne({ where: {

      email: 'steven@anypay.global'

    }});

    for (let i = 0; i < batches.length; i++) {

      let ach1 = await models.AccountAch.findOne({ where: {

        account_id: account1.id

      }});

      let ach2 = await models.AccountAch.findOne({ where: {

        account_id: account2.id

      }});

      if (ach1) {
        ach1.total_paid = batches[i].amount;
        await ach1.save();
      }

      if (ach2) {
        ach2.total_paid = batches[i].amount;
        await ach2.save();
      }

    }

  });

program
  .command('generate_latest_ach <end_date> [note]')
  .action(async (end_date, note) => {

    end_date = moment(end_date).toDate();

    try {

      let {ach_batch, invoices}= await ach.generateLatestBatch(end_date, note);

      invoices.forEach(invoice => {
        assert(invoice.ach_batch_id = ach_batch.id);
      });

      console.log(`ach batch ${ach_batch.id} generated with ${invoices.length} invoices`);
      console.log(ach_batch.toJSON());

    } catch(error) {

      console.log(error.message);

    }

    process.exit(0);

  });

program
  .command('send_ach_report_email <batch_id> <email>')
  .action(async (batch_id, email) => {

    try {

      await wire.sendAchReportEmail(batch_id, email);

    } catch(error) {

      console.log(error.message);

    }

    process.exit(0);

  });


program
  .command('invoices_without_ach_batch <account_email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: {
      email
    }});

    let query = `select count(*) from invoices where account_id = ${account.id}
      and ach_batch_id is null`;

    let result = await database.query(query);

    console.log(`${result[0][0].count} invoices need ach_batch_id`);

    process.exit(0);

  });

program
  .command('invoices_with_ach_batch <account_email>')
  .action(async (email) => {

    let account = await models.Account.findOne({ where: {
      email
    }});

    let query = `select count(*) from invoices where account_id = ${account.id}
      and ach_batch_id is not null`;

    let result = await database.query(query);

    console.log(`${result[0][0].count} invoices have ach_batch_id`);

    process.exit(0);

  });

program
  .command('backfill_ach_batch_id_invoices <batch_id> <account_email>')
  .action(async (batch_id, email) => {

    let account = await models.Account.findOne({ where: {
      email
    }});

    let batch = await models.AchBatch.findOne({ where: {
      id: batch_id
    }});

    try {

      let firstInvoice = await models.Invoice.findOne({ where: {
        uid: batch.first_invoice_uid
      }});

      let lastInvoice = await models.Invoice.findOne({ where: {
        uid: batch.last_invoice_uid
      }});

      //find all invoices in range for ach batch
      let invoices = await models.Invoice.findAll({
        where: {
          account_id: account.id,
          status: {
            [Op.ne]: 'unpaid'
          },
          id: {
            [Op.gte]: firstInvoice.id,
            [Op.lte]: lastInvoice.id
          },
          ach_batch_id: {
            [Op.eq]: null
          }
        }
      });

      console.log(`${invoices.length} invoices found for that batch`);

      let sum = invoices.reduce((sum, invoice) => {
        sum = sum + invoice.denomination_amount_paid;
        sum = sum - invoice.cashback_denomination_amount;
        return sum;
      }, 0);

      sum = parseFloat(sum.toFixed(2));

      console.log(`totallying $${sum} -> should be $${batch.amount}`);


      for (let i = 0; i < invoices.length; i++) {
        let invoice = invoices[i];
        if (!invoice.ach_batch_id) {
          invoice.ach_batch_id = batch.id;
          await invoice.save();
        }
      }

    } catch(error) {

      console.log(error.message);

    }

    process.exit(0);

  });

program
  .parse(process.argv);
