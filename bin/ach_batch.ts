#!/usr/bin/env ts-node

import * as program from 'commander';

import { models, log } from '../lib';

import * as fs from 'fs';

import { join } from 'path';

import * as csvParse from 'csv-parse';

async function findAchBatch(batchId) {

  return models.AchBatch.findOne({ where: { batch_id: batchId }});

}

interface AchBatch {
  batch_id: number;
  effective_date: Date;
  type: string;
  batch_description: string;
  originating_account: string;
  amount: number;
  currency: number;
}

async function recordAchBatch(batch: AchBatch) {

  return models.AchBatch.create(batch);

}

async function findOrRecordAchBatch(batch: AchBatch) {

  var record = await findAchBatch(batch.batch_id);

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
  .parse(process.argv);
