
import { models } from './models';

import * as moment from 'moment';

import { Op } from 'sequelize';

import { join } from 'path';

import { Account } from './account'

export async function getInvoicesByDates(accountId, start, end) {

  let invoices = await models.Invoice.findAll({

    where: {

      account_id: accountId,

      complete: true,

      completed_at: {

        [Op.gte]: start,

        [Op.lt]: end

      }

    },

    order: [['completed_at', 'desc']],

  });

  invoices = invoices.map(invoice => {

    invoice.completed = moment(invoice.completed_at).format('MM/DD/YYYY');

    invoice.completed_at = moment(invoice.completed_at).format('MM/DD/YYYY');

    return invoice;

  });

  return invoices;
}

interface ReportInvoice {

  invoice_uid: string;
  invoice_date: Date;
  invoice_amount: number;
  invoice_currency: string;
  invoice_external_id?: string;

  payment_date?: Date;
  payment_amount?: number;
  payment_currency?: string;
  payment_txid?: string;

  refund_txid?: string;
}

export async function buildAccountCsvReport(account: Account): Promise<string> {

  let paidInvoices = await models.Invoice.findAll({
    where: {
      status: 'paid',
      account_id: account.get('id'),
      app_id: null
    },

    include: [{
      model: models.Payment,
      as: 'payment'
    }, {
      model: models.Refund,
      as: 'refund'
    }],

    order: [['paidAt', 'desc']]
  })

  let invoices = paidInvoices.map(invoice => {

    let data = {
      invoice_uid: invoice.uid,
      invoice_date: invoice.createdAt,
      invoice_amount: invoice.denomination_amount,
      invoice_currency: invoice.denomination_currency,
      invoice_external_id: invoice.external_id
    }

    data['payment_date'] = invoice.paidAt
    data['payment_currency'] = invoice.invoice_currency
    data['payment_amount'] = invoice.invoice_amount
    data['payment_txid'] = invoice.hash

    if (invoice.refund) {
      data['refund_address'] = invoice.refund.address
      data['refund_txid'] = invoice.refund.txid
      data['refund_address'] = invoice.refund.address
    }

    return data

  })

  return buildReportCsv(invoices, '')

}

export async function buildReportCsv(invoices: ReportInvoice[], filepath: string): Promise<string> {

  const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
  const csvStringifier = createCsvStringifier({
    path: filepath,
    header: [
      {id: 'invoice_date', title: 'Date Invoiced'},
      {id: 'invoice_amount', title: 'Amount Invoiced'},
      {id: 'invoice_currency', title: 'Currency Invoiced'},
      {id: 'invoice_uid', title: 'Invoice ID'},
      {id: 'payment_currency', title: 'Payment Currency'},
      {id: 'payment_amount', title: 'Payment Amount'},
      {id: 'payment_date', title: 'Payment Date'},
      {id: 'payment_txid', title: 'Payment Txid'},
      {id: 'external_id', title: 'External Reference ID'},
      {id: 'refund_address', title: 'Refund Address'},
      {id: 'refund_txid', title: 'Refund Txid'}
    ]
  });

  let header = await csvStringifier.getHeaderString();

  let records = await csvStringifier.stringifyRecords(invoices.map((invoice: ReportInvoice) => {

    return Object.assign(invoice, {
      invoice_date: moment(invoice.invoice_date).format('YYYY-MM-DD hh:mm:ss'),
      payment_date: moment(invoice.payment_date).format('YYYY-MM-DD hh:mm:ss')
    })
    
  }));

  return `${header}\t${records}`;

}

export async function buildReportCsvFromDates(accountId, start, end) {

  let invoices = await getInvoicesByDates(accountId, start, end);

  let filepath = join(__dirname,
  `../../.tmp/account-${accountId}-${start}-${end}.csv`);

  return buildReportCsv(invoices, filepath);

}


