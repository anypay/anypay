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
import { invoices as Invoice } from '@prisma/client'

import { payments as Payment } from '@prisma/client'

import prisma from './prisma';

interface PaymentDetails {
  txid: string;
  currency: string;
  txhex: string;
  txjson?: any;
}

export async function recordPayment(invoice: Invoice, details: PaymentDetails): Promise<Payment> {

  let payment = await getPayment(invoice)

  if (payment) {

    throw new Error('Multiple payments for invoice not allowed')
  }

  const option = await prisma.payment_options.findFirstOrThrow({
    where: {
      invoice_uid: String(invoice.uid),
      currency: details.currency
    }
  })

  const record = await prisma.payments.create({
    data: {
      ...details,
      invoice_uid: String(invoice.uid),
      payment_option_id: option.id,
      currency: option.currency,
      chain: option.chain || option.currency,
      account_id: invoice.account_id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return record

}

export async function getPayment(invoice: Invoice): Promise<Payment | null> {

  const record = await prisma.payments.findFirst({
    where: {
      invoice_uid: String(invoice.uid)
    }
  })

  if (!record) { return null}

  return record

}

export async function listPayments(account: { id: number }, params: { limit: number, offset: number } = { limit: 100, offset: 0 }): Promise<any[]> {
  return prisma.payments.findMany({
    where: {
      account_id: account.id,
    },
    take: params.limit,
    skip: params.offset,
    orderBy: { createdAt: 'desc' }
  });
}
