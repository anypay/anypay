
import { models } from './models'

import { createPaymentRequest } from './payment_requests'

import { getDecodedTransaction, CURRENCIES } from './blockchair'

import { Invoice } from './invoices'

import { Orm } from './orm'

import { createApp } from './apps'
import { log } from './log'

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
      currency: invoice.get('invoice_currency'),
      to: [{
        address,
        amount: parseFloat(invoice.get('denomination_amount_paid')),
        currency: invoice.get('denomination') || invoice.get('invoice_currency')
      }]
    }]

    const app = await createApp({
      account_id: invoice.get('account_id'),
      name: '@refunds'
    })

    let payment_request = await createPaymentRequest(
      app.id,
      template,
      {}
    )


    let refund_invoice_uid = payment_request.get('invoice_uid')

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

  log.info('refunds.getAddressForInvoice', invoice.record.dataValues)

  if (invoice.get('status') === 'unpaid') {

    throw new RefundErrorInvoiceNotPaid()
  }

  const currency = CURRENCIES[invoice.get('payment_currency') || invoice.get('invoice_currency') || invoice.get('currency')]

  let rawtx = await getDecodedTransaction(currency, invoice.get('hash'))

  let inputTx = await getDecodedTransaction(currency, rawtx.vin[0].txid)

  return {
    currency: invoice.get('currency'),
    invoice,
    value: inputTx.vout[rawtx.vin[0].vout].scriptPubKey.addresses[0]
  }
}