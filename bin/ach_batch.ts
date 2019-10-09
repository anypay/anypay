#!/usr/bin/env ts-node

import * as program from 'commander';

import { models, log } from '../lib';
import * as ach from '../lib/ach';

import * as fs from 'fs';

import { join } from 'path';

import * as csvParse from 'csv-parse';

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
  .command('getinvoicerange <email <startUid> <endUid>')
  .action(async (email, startUid, endUid) => {

    try {

      let account = await models.Account.findOne({ where: { email }});

      let invoices = await ach.getInvoiceRange(startUid, endUid, {

        account_id: account.id 

      });

      console.log(invoices);

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .parse(process.argv);
