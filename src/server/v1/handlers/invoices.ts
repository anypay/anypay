
const _ = require('lodash')

import { Request, ResponseToolkit } from '@hapi/hapi';
import { log } from '@/lib';

import { createInvoice } from '@/lib/invoices'
import {
  invoices as Invoice,
} from '@prisma/client'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import prisma from '@/lib/prisma';

interface InvoiceAdditions {
  webhook_url?: string;
  redirect_url?: string;
  wordpress_site_url?: string;
  tags?: string[];
  external_id?: string;
  is_public_request?: boolean;
  headers?: Record<string, any>;
  email?: string;
  business_id?: string;
  location_id?: string;
  register_id?: string;
}

export async function setInvoiceAdditions(invoice: Invoice, additions: InvoiceAdditions): Promise<Invoice> {

  return invoice;

}

export async function show(request: Request, h: ResponseToolkit) {

  try {

    const invoice = await prisma.invoices.findFirst({
      where: { uid: request.params.invoice_uid }
    })

    if (!invoice) {

      return h.response({ error: 'invoice not found' }).code(404)

    }
    
    const payment = await prisma.payments.findFirst({
      where: { invoice_uid: invoice.uid }
    })

    var response: {
      invoice: {
        currency: string;
        amount: number;
        status: string;
        createdAt: Date;
      };
      payment?: any;
      kraken_deposits?: any;
    
    } = {
      invoice: {
        currency: String(invoice.currency),
        // if invoice.amount is a string, convert it to a number
        amount: parseFloat(String(invoice.amount)),
        status: invoice.status,
        createdAt: invoice.createdAt
      }
    }

    if (payment) { response['payment'] = payment }

    response['kraken_deposits'] = await prisma.krakenDeposits.findMany({
      where: {
        account_id: Number(invoice.account_id),
        txid: String(invoice.hash)
      }
    })

    return h.response(response).code(200)

  } catch(error: any) {

    console.error('invoic.show.error', error)

    return h.response({ error: error.message }).code(500)

  }

}

export async function create (request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  // TODO: Refactor to call only a SINGLE core library method

  log.info('api.v1.invoices.create', Object.assign({
    account_id: (request as AuthenticatedRequest).account.id
  }, request.payload))

  const payload = request.payload as {
    amount: number;
    currency: string;
    external_id: string;
    business_id: string;
    location_id: string;
    register_id: string;
    webhook_url: string;
    redirect_url: string;
    memo: string;
    fee_rate_level: string;
    wordpress_site_url: string;
    email: string;
  }

  let invoice = await createInvoice({
    account: (request as AuthenticatedRequest).account,
    amount: payload.amount,
    currency: payload.currency,
    external_id: payload.external_id,
    business_id: payload.business_id,
    location_id: payload.location_id,
    register_id: payload.register_id,
    webhook_url: payload.webhook_url,
    redirect_url: payload.redirect_url,
    memo: payload.memo,
    fee_rate_level: payload.fee_rate_level,
    wordpress_site_url: payload.wordpress_site_url,
    email: payload.email
  })

  const additional: InvoiceAdditions = {}

  additional.is_public_request = (request as AuthenticatedRequest).is_public_request ? true : false

  additional.headers = request.headers

  await setInvoiceAdditions(invoice, additional)

  await prisma.invoices.update({
    where: { id: invoice.id },
    data: {
      is_public_request: additional.is_public_request,
      headers: additional.headers
    }
  
  })

  invoice = await prisma.invoices.findFirstOrThrow({
    where: { id: invoice.id }
  })

  let payment_options = await getPaymentOptions(invoice)

  return h.response({

    invoice: {
      ...invoice,
      amount: invoice.amount?.toNumber(),
      currency: invoice.currency,
      uid: invoice.uid,
      status: invoice.status
    },

    payment_options

  }).code(201);

};

async function getPaymentOptions(invoice: Invoice): Promise<{
  uri: string;
  currency: string;
  amount: number;

}[]> { 

  const payment_options = await prisma.payment_options.findMany({
    where: { invoice_uid: invoice.uid }
  })

  return payment_options.map(option => _.pick(option,
    'uri',
    'currency',
    'amount'
  ))

}
