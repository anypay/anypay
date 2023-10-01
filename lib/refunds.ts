

import { createPaymentRequest } from './payment_requests'

import { getDecodedTransaction, CURRENCIES } from './blockchair'

import { createApp } from './apps'
import { log } from './log'
import { invoices, Refunds } from '@prisma/client'
import { prisma } from './prisma'

interface RefundAddress {
  currency: string;
  value: string;
  invoice: invoices;
}

export class RefundErrorInvoiceNotPaid extends Error {}

export async function getRefund(invoice: invoices, address?: string): Promise<Refunds> {

  const original_invoice_uid = invoice.uid

  let refund = await prisma.refunds.findFirst({
    where: {
      original_invoice_uid
    }
  })

  if (!refund) {

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
      account_id: invoice.account_id,
      name: '@refunds'
    })

    let payment_request = await createPaymentRequest(
      app.id,
      template,
      {}
    )


    let refund_invoice_uid = payment_request.get('invoice_uid')

    refund = await prisma.refunds.create({
      data: {
        original_invoice_uid,
        refund_invoice_uid,
        status: 'unpaid',
        address,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  }

  return refund

}

export async function getAddressForInvoice(invoice: invoices): Promise<RefundAddress> {

  log.info('refunds.getAddressForInvoice', invoice)

  if (invoice.status === 'unpaid') {

    throw new RefundErrorInvoiceNotPaid()
  }

  const currency = CURRENCIES[invoice.currency]

  let rawtx = await getDecodedTransaction(currency, invoice.hash)

  let inputTx = await getDecodedTransaction(currency, rawtx.vin[0].txid)

  return {
    currency: invoice.currency,
    invoice,
    value: inputTx.vout[rawtx.vin[0].vout].scriptPubKey.addresses[0]
  }
}