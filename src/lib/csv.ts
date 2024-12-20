/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
import moment from 'moment';

import { join } from 'path';

import {
  accounts as Account,
  invoices as Invoice
} from '@prisma/client'
import prisma from '@/lib/prisma';

export async function getInvoicesByDates(accountId: number, start: Date, end: Date): Promise<Invoice[]> {

  const invoices = await prisma.invoices.findMany({
    where: {
      account_id: accountId,
      complete: true,
      completed_at: {
        gte: start,
        lt: end
      }
    },
    orderBy: {
      completed_at: 'desc'
    }
  })

  return invoices;
}

export async function getInvoices(invoiceUID: string) {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoiceUID
    }
  })

  const invoices = await prisma.invoices.findMany({
    where: {
      account_id: invoice.account_id,
      complete: true,
      //completed_at is greater than the invoice completed_at
      completed_at: {
        gt: invoice.completed_at as Date
      }

    },
    orderBy: {
      createdAt: 'desc'
    }
  })

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

  const paidInvoices = await prisma.invoices.findMany({
    where: {
      status: 'paid',
      account_id: account.id,
      app_id: null
    },
    orderBy: {
      paidAt: 'desc'
    }
  });

  let invoices = paidInvoices.map((invoice: Invoice) => {

    let data: ReportInvoice = {
      invoice_uid: invoice.uid,
      invoice_date: invoice.createdAt,
      invoice_amount: Number(invoice.denomination_amount),
      invoice_currency: String(invoice.denomination_currency),
      invoice_external_id: String(invoice.external_id)
    }

    data['payment_date'] = invoice.paidAt as Date
    data['payment_currency'] = String(invoice.invoice_currency)
    data['payment_amount'] = Number(invoice.invoice_amount)
    data['payment_txid'] = String(invoice.hash)

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

export async function buildReportCsvFromDates(accountId: number, start: Date, end: Date) {

  let invoices = await getInvoicesByDates(accountId, start, end);

  let filepath = join(__dirname,
  `../../.tmp/account-${accountId}-${start}-${end}.csv`);

  const formattedInvoices: ReportInvoice[] = invoices.map((invoice: Invoice) => {
      
      let data: ReportInvoice = {
        invoice_uid: invoice.uid,
        invoice_date: invoice.createdAt,
        invoice_amount: Number(invoice.denomination_amount),
        invoice_currency: String(invoice.denomination_currency),
        invoice_external_id: String(invoice.external_id)
      }
  
      data['payment_date'] = invoice.paidAt as Date
      data['payment_currency'] = String(invoice.invoice_currency)
      data['payment_amount'] = Number(invoice.invoice_amount)
      data['payment_txid'] = String(invoice.hash)
  
      return data
  
    })

  return buildReportCsv(formattedInvoices, filepath);

}

export async function buildAllTimeReport(accountId: number) {


  const invoices = await prisma.invoices.findMany({
    where: {
      account_id: accountId
    }
  })

  let formattedInvoices = invoices.map((invoice: Invoice) => {
    var i = JSON.parse(JSON.stringify(invoice))
    i.created_at = moment(i.createdAt).format("MM/DD/YYYY");
    return i;
  });

  let filepath = join(__dirname, `../../.tmp/account-${accountId}-complete-history.csv`);

  return buildReportCsv(formattedInvoices, filepath);

}

export async function buildReportCsvFromInvoiceUID(invoiceUid: string): Promise<string> {

  let invoices = await getInvoices(invoiceUid);

  let filepath = join(__dirname, `../../.tmp/${invoiceUid}.csv`);

  const formattedInvoices: ReportInvoice[] = invoices.map((invoice: Invoice) => {
        
        let data: ReportInvoice = {
          invoice_uid: invoice.uid,
          invoice_date: invoice.createdAt,
          invoice_amount: Number(invoice.denomination_amount),
          invoice_currency: String(invoice.denomination_currency),
          invoice_external_id: String(invoice.external_id)
        }
    
        data['payment_date'] = invoice.paidAt as Date
        data['payment_currency'] = String(invoice.invoice_currency)
        data['payment_amount'] = Number(invoice.invoice_amount)
        data['payment_txid'] = String(invoice.hash)
    
        return data
    
      }
  )

  return buildReportCsv(formattedInvoices, filepath);

}


