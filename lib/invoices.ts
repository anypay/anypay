

import { log } from './log'

import { createWebhookForInvoice } from './webhooks'

import { computeInvoiceURI } from './uri'

import { Orm } from './orm'

import { nanoid } from 'nanoid'

import { createPaymentOptions } from './invoice'

import { publish } from './amqp'

import { accounts, invoices } from '@prisma/client'

import { prisma } from './prisma'

export class InvoiceNotFound implements Error {
  name = 'InvoiceNotFound'
  message = 'Invoice Not Found'
}

export async function ensureInvoice(uid: string): Promise<invoices> {

  return prisma.invoices.findFirstOrThrow({
    where: { uid }
  })

}
export async function getInvoice(uid: string): Promise<invoices> {

  return prisma.invoices.findFirst({
    where: { uid }
  })

}

export async function cancelInvoice(invoice: invoices) {

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

  publish('invoice.cancelled', { uid: invoice.uid })

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
  account: accounts,
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
/**
 * Creates a new invoice and a related payment request.
 * 
 * @param params - Parameters for creating a new invoice.
 * @returns A Promise that resolves to the newly created Invoice instance.
 */
export async function createInvoice(params: CreateInvoice): Promise<invoices> {
  const uid = nanoid(12);
  let { redirect_url, webhook_url, account, amount, currency } = params;

  if (!webhook_url) {
    webhook_url = account.webhook_url;
  }

  const newInvoice = {
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
      uid,
    }),
  };

  const invoice = await prisma.invoices.create({
    data: {
      ...newInvoice,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await createWebhookForInvoice(invoice);

  const paymentOptions = await createPaymentOptions(account, invoice);

  const paymentRequests = paymentOptions.map(option => ({
    app_id: 1,
    account_id: account.id,
    template: {
      currency: option.currency,
      to: [
        {
          currency: invoice.denomination_currency,
          amount: invoice.denomination_amount,
          address: option.address,
        },
      ],
    },
    status: 'unpaid',
    invoice_uid: invoice.uid,
  }));

  await prisma.paymentRequests.createMany({
    data: paymentRequests.map(request => ({
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  });

  // Replace log.info with actual logging
  console.log('paymentrequest.created', paymentRequests);
  console.log('invoice.created', { ...invoice, invoice_uid: invoice.uid });

  return invoice;
}