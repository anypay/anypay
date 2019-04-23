
import * as models from '../models';

import * as moment from 'moment';

import { readFileSync } from 'fs';

import { Op } from 'sequelize';

import * as Handlebars from 'handlebars';

import { join } from 'path';

export async function buildWireEmailReport(invoiceUID: string) {

  /*
   * 1) Check to see when last invoice was
   *   - here provided by command line
   *   - will be provided manually Derrick
   */

  let invoice = await models.Invoice.findOne({ where: { uid: invoiceUID }});

  let account = await models.Account.findOne({
    where: { id: invoice.account_id }
  });

  /*
   * 2) Look in slack for all invoices starting at that
   *   invoice number
   *
   *   - here use database to query all completed invoices since
   *     the one indicated in step 1
   *
   */

  let templateSource = readFileSync(join(__dirname, './template.hbs'));

  let template = Handlebars.compile(templateSource.toString('utf8'));

  let invoices = await models.Invoice.findAll({

    where: {

      account_id: account.id,

      complete: true,

      completed_at: {

        [Op.gt]: invoice.completed_at

      }

    }

  });

  invoices = invoices.map(invoice => {

    if (!invoice.cashback_denomination_amount) {

      invoice.cashback_denomination_amount = 0;
    }

    return invoice;

  });

  let total = invoices.reduce(function(acc, invoice) {

    acc += invoice.settlement_amount;

    return acc;

  }, 0);

  let start_date = moment(invoices[0].completed_at).format('MM-DD-YYYY');
  let end_date = moment(invoices[invoices.length - 1].completed_at).format('MM-DD-YYYY');


  let content = template({
    invoices,
    total,
    start_date,
    end_date
  });

  console.log('content', content);

  //let filepath = await buildReportCsv(invoices, invoiceUID);

  //console.log(`csv written to ${filepath}`);

  return content;

}

async function buildReportCsv(invoices, invoiceUID: string): Promise<string> {

  let filepath = join(__dirname, `../../.tmp/${invoiceUID}.csv`);

  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: filepath,
    header: [
      {id: 'external_id', title: 'EXTERNAL ID'},
      {id: 'uid', title: 'INVOICE UID'},
      {id: 'denomination_amount_paid', title: 'AMOUNT PAID'},
      {id: 'completed_at', title: 'DATE PAID'},
    ]
  });

  await csvWriter.writeRecords(invoices)

  return filepath;

}


