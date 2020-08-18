
import { join } from 'path';

import * as AWS from 'aws-sdk';

var s3 = new AWS.S3();

import { readFileSync } from 'fs';

import * as csvParse from 'csv-parse';

import { models } from '../models';
import { log } from '../logger';

interface GeneralbytesSale {
    terminal_sn: string;
    server_time: Date;
    terminal_time: Date;
    local_transaction_id: string;
    remote_transaction_id: string;
    type: string;
    cash_amount: number;
    cash_currency: string;
    crypto_amount?: number;
    crypto_currency?: string;
    used_discount?: string;
    actual_discount?: number;
    destination_address?: string;
    related_remote_transaction_id?: string;
    identity?: string;
    status: string;
    phone_number?: string;
    transaction_detail?: string;
    transaction_note?: string;
    rate_including_fee?: number;
    rate_without_fee?: number;
    fixed_transaction_fee?: number;
    expected_profit_percent_setting?: number;
    expected_profit_value?: number;
    crypto_setting_name?: string;
    identity_first_name?: string;
    identity_id_card_number?: string;
    identity_phone_number?: string;
}

export function csvToGBSales(csv: string): Promise<GeneralbytesSale[]> {

  return new Promise((resolve, reject) => {

    csvParse(csv, (err, output) => {

      if (err) { return reject(err) }

      // remove header row
      output.shift();

      resolve(output.map(row => {

        var crypto_amount = row[8];
        if (crypto_amount) {
          crypto_amount = parseFloat(row[8]);
        } else {
          crypto_amount = 0;
        }

        var actual_discount = row[11];
        if (actual_discount) {
          actual_discount = parseFloat(row[11]);
        } else {
          actual_discount = 0;
        }

        var rate_including_fee = row[19];
        if (rate_including_fee) {
          rate_including_fee = parseFloat(row[19]);
        } else {
          rate_including_fee = 0;
        }

        var rate_without_fee = row[20];
        if (rate_without_fee) {
          rate_without_fee = parseFloat(row[20]);
        } else {
          rate_without_fee = 0;
        }

        var fixed_transaction_fee = row[21];
        if (fixed_transaction_fee) {
          fixed_transaction_fee = parseFloat(row[21]);
        } else {
          fixed_transaction_fee = 0;
        }

        var expected_profit_percent_setting = row[22];
        if (expected_profit_percent_setting) {
          expected_profit_percent_setting = parseFloat(row[22]);
        } else {
          expected_profit_percent_setting = 0;
        }

        var expected_profit_value = row[23];
        if (expected_profit_value) {
          expected_profit_value = parseFloat(row[23]);
        } else {
          expected_profit_value = 0;
        }

        return {
          terminal_sn: row[0],
          server_time: new Date(row[1]),
          terminal_time: new Date(row[2]),
          local_transaction_id: row[3],
          remote_transaction_id: row[4],
          type: row[5],
          cash_amount: parseInt(row[6]),
          cash_currency: row[7],
          crypto_amount,
          crypto_currency: row[9],
          used_discount: row[10],
          actual_discount,
          destination_address: row[12],
          related_remote_transaction_id: row[13],
          identity: row[14],
          status: row[15],
          phone_number: row[16],
          transaction_detail: row[17],
          transaction_note: row[18],
          rate_including_fee,
          rate_without_fee,
          fixed_transaction_fee,
          expected_profit_percent_setting,
          expected_profit_value,
          crypto_setting_name: row[24],
          identity_first_name: row[25],
          identity_id_card_number: row[26],
          identity_phone_number: row[27]
        }

      }));

    });

  });

}

export async function getCSVFromPath(path): Promise<any> {

  if (!path.match(/^\//)) {
    path = join(process.cwd(), path);
  }

  let file = readFileSync(path);

  return file.toString();

}

export async function importCSV(csv: string): Promise<any> {

  let sales: GeneralbytesSale[] = await csvToGBSales(csv);

  var newRecords = [];

  for (let i=0; i < sales.length; i++) {

    let sale = sales[i];

    var [record, isNew] = await models.GeneralbytesSale.findOrCreate({

      where: {

        local_transaction_id: sale.local_transaction_id
      },

      defaults: sale

    });

    if (isNew) {

      newRecords.push(record);
    }

    log.info('generalbytes_sale', JSON.stringify(record.toJSON()));

  }

  return newRecords;

}

export async function getCSVFromS3(): Promise<any> {

 return new Promise((resolve, reject) => {

   var params = {
     Bucket: "anypayinc.com", 
     Key: "generalbytes/batm_org@57_transactions_w_identity.csv"
   };

   s3.getObject(params, function(err, data) {
     if (err) { return reject(err) }
     log.info('s3.getobject', { parmas, body: data.Body.toString() })
     resolve(data.Body.toString())
   });

 });

}

