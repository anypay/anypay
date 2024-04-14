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

import { createPaymentRequest } from './payment_requests'

import { getDecodedTransaction, CURRENCIES } from './blockchair'

import {
  invoices as Invoice,
  Refunds as Refund
 } from '@prisma/client'

import { createApp } from './apps'

import prisma from './prisma'

export { Refund }

interface RefundAddress {
  currency: string;
  value: string;
  invoice: Invoice;
}

export class RefundErrorInvoiceNotPaid extends Error {}

export async function getRefund(invoice: Invoice, address?: string): Promise<Refund> {

  const original_invoice_uid = String (invoice.uid)
  
  let record = await prisma.refunds.findFirst({
    where: {
      original_invoice_uid
    }
  })

  if (!record) {

    if (!address) {

      let result = await getAddressForInvoice(invoice)

      address = result.value 
    }

    const payment = await prisma.payments.findFirstOrThrow({
      where: {
        invoice_uid: invoice.uid
      }
    })

    const template = [{
      currency: payment.currency,
      to: [{
        address,
        amount: invoice.denomination_amount || invoice.denomination_amount_paid,
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


    let refund_invoice_uid = String(payment_request.invoice_uid)

    record = await prisma.refunds.create({
      data: {
        original_invoice_uid,
        refund_invoice_uid,
        status: 'unpaid',
        address,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    })

  }

  return record

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