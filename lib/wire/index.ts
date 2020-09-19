
import { models } from '../models';

import * as moment from 'moment';

import { readFileSync } from 'fs';

import * as mustache from 'mustache';

import { Op } from 'sequelize';

import * as Handlebars from 'handlebars';

import { join } from 'path';

export async function getInvoicesByDates(accountId, start, end) {

  let invoices = await models.Invoice.findAll({

    where: {

      account_id: accountId,

      complete: true,

      completed_at: {

        [Op.gte]: start,

        [Op.lt]: end

      }

    }

  });

  invoices = invoices.map(invoice => {

    if (!invoice.cashback_denomination_amount) {

      invoice.cashback_denomination_amount = 0;
    }

    invoice.completed = moment(invoice.completed_at).format('MM/DD/YYYY');

    return invoice;

  });

  return invoices;
}

export async function getInvoices(invoiceUID: string) {

  /*:
   * 1) Check to see when last invoice was
   *   - here provided by command line
   *   - will be provided manually Derrick
   */

  let invoice = await models.Invoice.findOne({ where: { uid: invoiceUID }});

  if (!invoice) {
    throw new Error(`invoice ${invoiceUID} not found`);
  }

  let account = await models.Account.findOne({
    where: { id: invoice.account_id }
  });

  let invoices = await models.Invoice.findAll({

    where: {

      account_id: account.id,

      complete: true,

      completed_at: {

        [Op.gt]: invoice.completed_at

      }

    },

    order: [['createdAt', 'DESC']]

  });

  invoices = invoices.map(invoice => {

    if (invoice.status !== 'paid') {

      invoice.cashback_denomination_amount = 0;

    }

    if (!invoice.cashback_denomination_amount) {

      invoice.cashback_denomination_amount = 0;
    }

    invoice.completed = moment(invoice.completed_at).format('MM/DD/YYYY');

    return invoice;

  });

  return invoices;

}
export async function buildAchBatchEmailReport(ach_batch_id: number) {

  let batch = await models.AchBatch.findOne({ where: { id: ach_batch_id }});

  let previousBatch = await models.AchBatch.findOne({

    where: {
      id: { [Op.lt]: batch.id }
    },

    order: [['id', 'desc']]

  });

  let firstInvoice = await models.Invoice.findOne({ where: {
    uid: batch.first_invoice_uid
  }});

  let lastInvoice = await models.Invoice.findOne({ where: {
    uid: batch.last_invoice_uid
  }});

  let templateSource = readFileSync(join(__dirname, './template.mustache'));

  //let template = Handlebars.compile(templateSource.toString('utf8'));

  let invoices = await models.Invoice.findAll({
    where: {
      account_id: firstInvoice.account_id,
      status: {
        [Op.ne]: 'unpaid'
      },

      id: {
        [Op.gte]: firstInvoice.id,
        [Op.lte]: lastInvoice.id
      }
    }
  })

  let start_date = moment(firstInvoice.completed_at).format('MM-DD-YYYY');
  let end_date = moment(lastInvoice.completed_at).format('MM-DD-YYYY');

  let content = mustache.render(templateSource.toString('utf8'), {
    reportCSVURL: `https://api.sudo.anypayinc.com/api/wires/reportsinceinvoice/${previousBatch.last_invoice_uid}/csv`,
    invoices: invoices.map(invoice => {

      return Object.assign(invoice, {
        denomination_amount_paid: invoice.denomination_amount_paid.toFixed(2),
        cashback_denomination_amount: invoice.cashback_denomination_amount.toFixed(2),
        settlement_amount: invoice.settlement_amount.toFixed(2) 
      });

    }),
    total: batch.amount.toFixed(2),
    batch_id: batch.batch_id,
    effective_date: moment(batch.effective_date).format('dddd, MMMM Do YYYY'),
    start_date,
    end_date
  });

  return content;

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
    reportCSVURL: `https://api.sudo.anypayinc.com/api/wires/reportsinceinvoice/${invoiceUID}/csv`,
    invoices,
    total,
    start_date,
    end_date
  });

  return content;

}

export async function buildReportCsv(invoices: any[], filepath: string): Promise<string> {

  const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
  const csvStringifier = createCsvStringifier({
    path: filepath,
    header: [
      {id: 'paid_at', title: 'Paid at'},
      {id: 'denomination_amount', title: 'Amount Invoiced'},
      {id: 'denomination_amount_paid', title: 'Amount Paid (USD)'},
      {id: 'cashback_denomination_amount', title: 'Minus Dash Back (USD)'},
      {id: 'settlement_amount', title: 'Account Gets (USD)'},
      {id: 'external_id', title: 'Reference'},
      {id: 'currency', title: 'Currency'},
      {id: 'amount', title: 'Amount Paid (Crypto)'},
      {id: 'uid', title: 'Invoice ID'}
    ]
  });

  let header = await csvStringifier.getHeaderString();

  let records = await csvStringifier.stringifyRecords(invoices.map((invoice: any) => {

    invoice.paid_at = moment(invoice.completed_at).format('MM/DD/YYYY');

    return invoice;
    
  }));

  return `${header}\t${records}`;

}

export async function buildReportCsvFromDates(accountId, start, end) {

  let invoices = await getInvoicesByDates(accountId, start, end);

  let filepath = join(__dirname,
  `../../.tmp/account-${accountId}-${start}-${end}.csv`);

  return buildReportCsv(invoices, filepath);

}

export async function buildAllTimeReport(accountId) {

  let invoices = await models.Invoice.findAll({ where: {account_id: accountId }});

  invoices = invoices.map(invoice => {
    var i = invoice.toJSON();
    i.created_at = moment(i.createdAt).format("MM/DD/YYYY");
    return i;
  });

  let filepath = join(__dirname, `../../.tmp/account-${accountId}-complete-history.csv`);

  return buildReportCsv(invoices, filepath);

}

export async function buildReportCsvFromInvoiceUID(invoiceUid: string): Promise<string> {

  let invoices = await getInvoices(invoiceUid);

  let filepath = join(__dirname, `../../.tmp/${invoiceUid}.csv`);

  return buildReportCsv(invoices, filepath);

}


