const Boom = require('boom');

import { log, invoices } from '@/lib';

import {
  invoices as Invoice,
  Prisma
} from '@prisma/client'

import { createInvoice, cancelInvoice } from '@/lib/invoices';

import { computeInvoiceURI } from '@/lib/uri'

import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { badRequest } from '@hapi/boom';
import prisma from '@/lib/prisma';

export async function cancel(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  let where: {
    uid: string,
    account_id: number,
    status?: string
  } = {
    uid: request.params.uid,
    account_id: (request as AuthenticatedRequest).account.id
  }

  let invoice = await prisma.invoices.findFirst({
    where
  })

  if (!invoice) {

    log.error('invoice.notfound', new Error(JSON.stringify(where)))

    return Boom.notFound()

  }

  if (invoice && !invoice.cancelled) {

    await cancelInvoice(invoice)

    where['status'] = 'cancelled'

    return where

  } else {

    log.error('invoice.cancel.error.alreadycancelled', new Error(JSON.stringify(where)))

    throw new Error('invoice already cancelled')

  } 

}

export async function index (request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  /*

    QUERY OPTIONS

      - offset
      - limit
      - status
      - complete
      - start_date_created
      - end_date_created
      - start_date_completed
      - end_date_completed

  */


  const startDateCreated = request.query.start_date_created;
  const endDateCreated = request.query.end_date_created;
  const take = request.query.limit || 100;
  const skip = request.query.offset || 0;
  
  const query: Prisma.invoicesFindManyArgs = {};
  
  if (startDateCreated) {
    query.where = {
      ...query.where,
      createdAt: {
        // Greater than or equal to the start date
        gte: new Date(startDateCreated),
      },
    };
  }
  
  if (endDateCreated) {
    query.where = {
      ...query.where,
      createdAt: {
        // Less than the end date
        lt: new Date(endDateCreated),
      },
    };
  }
  const invoices = await prisma.invoices.findMany({
    where: query.where,
    take,
    skip
  })

  return { invoices };

};

export async function createDeprecated(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  const account = (request as AuthenticatedRequest).account

  try {

    let invoice: Invoice = await createInvoice({
      account,
      ...request.payload as any
    })

    const json = JSON.parse(JSON.stringify(invoice))

    const payment_options = await getPaymentOptions(invoice.uid)

    const responseInvoice = {
      amount: json['amount'],
      currency: json['denomination'],
      status: json['status'],
      uid: json['uid'],
      uri: json['uri'],
      createdAt: json['createdAt'],
      expiresAt: json['expiry'],
      payment_options: payment_options.map(option => {

        const { chain, currency, instructions } = option as any

        const uri = computeInvoiceURI({ uid: json.uid, currency: chain })

        const amount = instructions[0].outputs.reduce((sum: number, output: { amount: number; }) => {

          return sum + output.amount

        }, 0)

        return {
          uri,
          chain,
          currency,
          amount 
        }

      })
    }

    return h.response({
      success: true,
      invoice: responseInvoice,
      uid: json['uid']
    })
    .code(200)

  } catch(error: any) {

    log.error('api.v0.invoices.create', error)

    return badRequest(error.message)

  }

}



export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {


  try {

    let invoice: Invoice = await createInvoice({
      account: (request as AuthenticatedRequest).account,
      ...request.payload as any
    })


    const json = JSON.parse(JSON.stringify(invoice))

    const payment_options = await getPaymentOptions(invoice.uid)

    const responseInvoice = {
      amount: json['amount'],
      currency: json['denomination'],
      status: json['status'],
      uid: json['uid'],
      uri: json['uri'],
      createdAt: json['createdAt'],
      expiresAt: json['expiry'],
      payment_options
    }

    return h.response({
      invoice: responseInvoice,
      uid: json['uid']
    })
    .code(200)

  } catch(error: any) {

    log.error('api.v0.invoices.create', error)

    return badRequest(error.message)

  }

}

import { getPaymentOptions } from '../../../lib/invoices'

function sanitizeInvoice(invoice: Invoice) {

  let resp = JSON.parse(JSON.stringify(invoice))

  delete resp.webhook_url;
  delete resp.id;
  delete resp.dollar_amount;
  delete resp.headers;
  delete resp.secret;
  delete resp.app_id;

  return resp;
}


export async function showDeprecated(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  let invoiceId = request.params.invoice_id;

  let invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoiceId
    }
  })

  if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

    invoice = await invoices.refreshInvoice(invoice.uid)

  }

  if (invoice) {

    log.debug('invoice.requested', invoice);

    let payment_options = await getPaymentOptions(invoice.uid)

    let notes = await prisma.invoice_notes.findMany({
      where: {
        invoice_uid: invoice.uid
      }
    })

    let sanitized = sanitizeInvoice(invoice);

    let resp = Object.assign({
      invoice: sanitized,
      payment_options,
      notes
    }, sanitized)

    return resp;

  } else {

    log.error('no invoice found', new Error(`invoice ${invoiceId} not found`));

    throw new Error('invoice not found')
  }

}


export async function show(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let invoiceId = request.params.invoice_id;

    let invoice = await prisma.invoices.findFirstOrThrow({
      where: {
        uid: invoiceId
      }
    })

    if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

      invoice = await invoices.refreshInvoice(invoice.uid)

    }

    if (invoice) {

      const payment_options = await getPaymentOptions(invoice.uid)

      const notes = await prisma.invoice_notes.findMany({
        where: {
          invoice_uid: invoice.uid
        }
      })

      const responseInvoice: any = {
        // if invoice.amount is a string, convert it to a number
        amount: parseFloat(String(invoice.amount)),
        currency: invoice.currency,
        status: invoice.status,
        uid: invoice.uid,
        uri: invoice.uri,
        createdAt: invoice.createdAt,
        expiresAt: invoice.expiry
      }

      if (invoice.hash) {
        responseInvoice['hash'] = invoice.hash
      }

      if (invoice.redirect_url) {
        responseInvoice['redirect_url'] = invoice.redirect_url
      }

      responseInvoice['payment_options'] = payment_options
      responseInvoice['notes'] = notes

      const response: {
        invoice: any,
        payment?: any
      
      } = {
        invoice: responseInvoice
      }

      if (invoice.hash) {

        let payment = prisma.payments.findFirst({
          where: {
            invoice_uid: invoice.uid
          }
        })

        if (payment) {

          const { chain, currency, txid, txhex, confirmation_hash, confirmation_date, confirmation_height, status, createdAt, invoice_uid, block_explorer_url } = JSON.parse(JSON.stringify(payment))

          response['payment'] = {
            invoice_uid,
            status,
            date: createdAt,
            chain,
            currency,
            txid,
            txhex,
            confirmation_hash,
            confirmation_date,
            confirmation_height,
            block_explorer_url
          }

        }

      }

      return h.response(response).code(200)

    } else {

      log.error('no invoice found', new Error(`invoice ${invoiceId} not found`));

      throw new Error('invoice not found')
    }

  } catch(error: any) {

    log.error('invoices.show.error', error)

    return badRequest(error.message)

  }

}

export async function showLegacy(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  let invoiceId = request.params.invoice_id;

  let invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: invoiceId
    }
  })

  if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

    invoice = await invoices.refreshInvoice(invoice.uid)

  }

  if (invoice) {

    log.debug('invoice.requested', invoice);

    const payment_options = await getPaymentOptions(invoice.uid)

    const notes = await prisma.invoice_notes.findMany({
      where: {
        invoice_uid: invoice.uid
      }
    })

    let sanitized = sanitizeInvoice(invoice);

    let resp = Object.assign({
      invoice: sanitized,
      payment_options,
      notes
    }, sanitized)

    return resp;

  } else {

    log.error('no invoice found', new Error(`invoice ${invoiceId} not found`));

    throw new Error('invoice not found')
  }

}
