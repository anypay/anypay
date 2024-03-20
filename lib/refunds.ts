
import { models } from './models'

import { createPaymentRequest } from './payment_requests'

import { getDecodedTransaction, CURRENCIES } from './blockchair'

import { invoices as Invoice } from '@prisma/client'

import { Orm } from './orm'

import { createApp } from './apps'

export class Refund extends Orm {

  original_invoice: Invoice;

  constructor(original_invoice: Invoice, record: any) {

    super(record);

    this.original_invoice = original_invoice;

  }

}

interface RefundAddress {
  currency: string;
  value: string;
  invoice: Invoice;
}

export class RefundErrorInvoiceNotPaid extends Error {}

export async function getRefund(invoice: Invoice, address?: string): Promise<Refund> {

  const original_invoice_uid = invoice.uid

  let record = await models.Refund.findOne({
    where: {
      original_invoice_uid
    }
  })

  if (!record) {

    if (!address) {

      let result = await getAddressForInvoice(invoice)

      address = result.value 
    }

    const template = [{
      currency: invoice.invoice_currency,
      to: [{
        address,
        amount: invoice.denomination_amount_paid,
        currency: invoice.denomination_currency || invoice.invoice_currency
      }]
    }]

    const app = await createApp({
      account_id: Number(invoice.account_id),
      name: '@refunds'
    })

    let payment_request = await createPaymentRequest(
      app.id,
      template,
      {}
    )


    let refund_invoice_uid = payment_request.invoice_uid

    record = await models.Refund.create({
      original_invoice_uid,
      refund_invoice_uid,
      status: 'unpaid',
      address
    })

  }

  return new Refund(invoice, record)

}

export async function getAddressForInvoice(invoice: Invoice): Promise<RefundAddress> {

  if (invoice.status === 'unpaid') {

    throw new RefundErrorInvoiceNotPaid()
  }
  

  const currency = CURRENCIES[invoice.invoice_currency ? String(invoice.invoice_currency) : String(invoice.currency)]

  let rawtx = await getDecodedTransaction(currency, String(invoice.hash))

  let inputTx = await getDecodedTransaction(currency, rawtx.vin[0].txid)

  return {
    currency: String(invoice.currency),
    invoice,
    value: inputTx.vout[rawtx.vin[0].vout].scriptPubKey.addresses[0]
  }
}