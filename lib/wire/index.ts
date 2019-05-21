
import * as models from '../models';

import * as moment from 'moment';

import { readFileSync } from 'fs';

import { Op } from 'sequelize';

import * as Handlebars from 'handlebars';

import { join } from 'path';

async function getInvoices(invoiceUID: string) {

  /*:
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

  return invoices;

}

export async function buildWireEmailReport(invoiceUID: string) {

  let templateSource = readFileSync(join(__dirname, './template.hbs'));

  let template = Handlebars.compile(templateSource.toString('utf8'));

  let invoices = await getInvoices(invoiceUID);

  let total = invoices.reduce(function(acc, invoice) {

    acc += invoice.settlement_amount;

    return acc;

  }, 0);

  let start_date = moment(invoices[0].completed_at).format('MM-DD-YYYY');
  let end_date = moment(invoices[invoices.length - 1].completed_at).format('MM-DD-YYYY');

  let content = template({
    reportCSVURL: `https://sudo.anypay.global/api/wires/reportsinceinvoice/${invoiceUID}/csv`,
    invoices,
    total,
    start_date,
    end_date
  });

  return content;

}

export async function buildReportCsv(invoiceUID: string): Promise<string> {

  let invoices = await getInvoices(invoiceUID);

  let filepath = join(__dirname, `../../.tmp/${invoiceUID}.csv`);

  const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
  const csvStringifier = createCsvStringifier({
    path: filepath,
    header: [
      {id: 'completed_at', title: 'Payment Completed At'},
      {id: 'denomination_amount_paid', title: 'Amount Paid (USD)'},
      {id: 'cashback_denomination_amount', title: 'Minus Dash Back (USD)'},
      {id: 'settlement_amount', title: 'eGifter Gets (USD)'},
      {id: 'external_id', title: 'Reference'},
      {id: 'uid', title: 'Invoice ID'},
    ]
  });

  let header = await csvStringifier.getHeaderString();
  let records = await csvStringifier.stringifyRecords(invoices)

  return `${header}\t${records}`;

}


