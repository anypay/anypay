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

import { log } from './log'

import { InvoiceCancelledEvent, createAndSendWebhook, createWebhookForInvoice } from './webhooks'

import {
  accounts as Account,
  invoices as Invoice
} from '@prisma/client'

import { computeInvoiceURI } from './uri'

import * as shortid from 'shortid';

import { createPaymentOptions } from './invoice'

import { publish, registerSchema } from './amqp'

import prisma from './prisma'

export { Invoice }

import { InvoiceCreatedEvent } from './webhooks'

export async function ensureInvoice(uid: string): Promise<Invoice> {

  return prisma.invoices.findFirstOrThrow({ where: { uid } })

}
export async function getInvoice(uid: string): Promise<Invoice | null> {

  return prisma.invoices.findFirst({ where: { uid } })

}

import { z } from 'zod'

registerSchema('invoice.cancelled', z.object({
  uid: z.string(),
  status: z.literal('cancelled'),
  timestamp: z.date()
}))

export async function cancelInvoice(invoice: Invoice) {

  if (invoice.status !== 'unpaid') {
    throw new Error('can only cancel unpaid invoices')
  }  

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'cancelled',
      cancelled: true
    }
  
  })

  log.info('invoice.cancelled', { uid: invoice.uid })

  publish('invoice.cancelled', {
    uid: invoice.uid,
    status: 'cancelled',
    timestamp: new Date()
  })

  const webhookPayload: InvoiceCancelledEvent = {
    topic: 'invoice.cancelled',
    payload: {
      app_id: invoice.app_id || undefined,
      account_id: invoice.account_id || undefined,
      invoice: {
        uid: String(invoice.uid),
        status: 'cancelled'
      }
    }
  }

  createAndSendWebhook('invoice.cancelled', webhookPayload)

  return invoice

}

export class InvalidWebhookURL implements Error {

  name = 'InvalidWebhookURL'

  message = 'webhook_url parameter must be a valid HTTPS URL'

  constructor(invalidURL: string) {

    this.message = `${this.message}: received ${invalidURL}`
  }
}

interface CreateInvoice {
  account: Account,
  amount: number;
  currency?: string;
  fee_rate_level?: string;
  redirect_url?: string;
  webhook_url?: string;
  wordpress_site_url?: string;
  external_id?: string;
  memo?: string;
  email?: string;
  business_id?: string;
  location_id?: string;
  register_id?: string;
}

export async function createInvoice(params: CreateInvoice): Promise<Invoice> {

  const uid = shortid.generate();

  var { redirect_url, account, amount, currency } = params

  let webhook_url: string | undefined = params.webhook_url

  if (!webhook_url && account.webhook_url) {

    webhook_url = account.webhook_url

  }

  const newInvoice: any = {

    denomination_currency: currency || account.denomination,

    denomination_amount: amount,

    currency: currency || account.denomination,

    amount: amount,

    account_id: account.id,

    webhook_url,

    redirect_url,

    external_id: params.external_id,

    business_id: params.business_id,

    location_id: params.location_id,

    register_id: params.register_id,

    memo: params.memo,

    wordpress_site_url: params.wordpress_site_url,

    fee_rate_level: params.fee_rate_level,

    status: 'unpaid',

    uid,

    uri: computeInvoiceURI({

      currency: 'ANYPAY',

      uid

    })

  }

  const invoice = await prisma.invoices.create({ data: newInvoice })

  createWebhookForInvoice(invoice)

  const paymentOptions = await createPaymentOptions(account, invoice)

  const paymentRequest = await prisma.paymentRequests.create({
      
      data: {
  
        app_id: 1,
    
        template: paymentOptions.map(option => {
  
          return {
            currency: option.currency,
            to: [{
              currency: invoice.denomination_currency,
              amount: invoice.denomination_amount,
              address: option.address
            }]
  
          }
        }),
  
        status: 'unpaid',
  
        invoice_uid: invoice.uid,

        updatedAt: new Date(),

        createdAt: new Date()
  
      }
  
    })


  log.info('paymentrequest.created', paymentRequest)

  log.info('invoice.created', invoice)

  publish('invoice.created', invoice)

  const webhookPayload: InvoiceCreatedEvent = {
    topic: 'invoice.created',
    payload: {
      app_id: invoice.app_id || undefined,
      account_id: invoice.account_id || undefined,
      invoice: {
        uid: String(invoice.uid),
        status: String(invoice.status),
        quote: {
          amount: Number(invoice.amount),
          currency: String(invoice.currency)
        },
      }
    }
  }

  createAndSendWebhook('invoice.created', webhookPayload)

  return invoice;

}

export async function listPaidInvoices(acocunt: Account): Promise<Invoice[]> {

  return prisma.invoices.findMany({
    where: {
      account_id: acocunt.id,
      status: 'paid'
    }
  })
}