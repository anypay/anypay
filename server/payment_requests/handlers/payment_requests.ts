
import { log, invoices } from '../../../lib';

import { cancelInvoice } from '../../../lib/invoices'

import { show as handleBIP70 } from './bip70_payment_requests'

import { show as handleJsonV2 } from './json_payment_requests'

import { show as handleBIP270 } from './bip270_payment_requests'

import { detectWallet } from '../../../lib/pay'

import { paymentRequestToPaymentOptions } from '../../../lib/payment_options'

import { listPaymentOptions, RequestWithInvoice } from '../../jsonV2/handlers/protocol'

import { createWebhookForInvoice } from '../../../lib/webhooks'

import { schema } from 'anypay'

import { ResponseToolkit } from '@hapi/hapi';

import { badRequest, notFound } from '@hapi/boom';

import prisma from '../../../lib/prisma';

import AuthenticatedRequest from '../../../server/auth/AuthenticatedRequest';

export async function cancel(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    const invoice = await prisma.invoices.findFirst({
      where:{ uid: request.params.uid }
    
    })

    if (!invoice) {
  
      return notFound()
    }
  
    if (invoice.app_id !== request.app.id) {
  
      return notAuthorized()
    }
  
    await cancelInvoice(invoice)
  
    return h.response({ success: true })

  } catch(error: any) {

    log.error('api.payment-requests.cancel', error)

    return badRequest(error.message)

  }

}

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    const payload = request.payload as {
      template: any;
      options: any
    }

    log.info('pay.request.create', { template: payload.template, options: payload.options })

    let { error, template } = schema.PaymentRequestTemplate.validate(payload.template)

    if (error) {

      log.error('pay.request.create.error', error)

      throw error

    } else {

      log.info('pay.request.create.template.valid', template)

      let record = await prisma.paymentRequests.create({
        data: {
          app_id: request.app.id,
          template: payload.template,
          status: 'unpaid',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      let invoice = await invoices.createEmptyInvoice(request.app_id)

      const update: {
        currency?: string;
        webhook_url?: string;
        redirect_url?: string;
        secret?: string;
        metadata?: any;
      
      } = {
      }

      update.currency = payload.template[0].currency

      if (payload.options) {

        update.webhook_url = payload.options.webhook

        update.redirect_url = payload.options.redirect

        update.secret = payload.options.secret

        update.metadata = payload.options.metadata

      }

      await prisma.invoices.update({
        where: { id: invoice.id },
        data: update
      })

      await prisma.paymentRequests.update({
        where: { id: record.id },
        data: {
          invoice_uid: invoice.uid,
          uri: invoice.uri,
          webpage_url: `https://anypayx.com/i/${invoice.uid}`,
          status: 'unpaid'
        }
      })

      record = await prisma.paymentRequests.findFirstOrThrow({
        where: { id: record.id },
      })

      await paymentRequestToPaymentOptions(record)

      log.info('pay.request.created', record)

      createWebhookForInvoice(invoice)

      return {

        uid: record.invoice_uid,

        uri: record.uri,

        url: record.webpage_url,

        payment_request: record

        //options: req.payload.options

      } 

    }

  } catch(error: any) {

    return badRequest(error.message);

  }

}

export async function show(request: RequestWithInvoice, h: ResponseToolkit) {

  //log.debug('pay.request.show', { uid: req.params.uid, headers: req.headers })

  detectWallet(request.headers, request.params.uid)

  request.invoice  = await prisma.invoices.findFirstOrThrow({
    where: { uid: request.params.uid }
  });

  if (request.invoice.cancelled) {
    
    return badRequest('invoice cancelled')
  }

  if (request.invoice.status === 'unpaid' && invoices.isExpired(request.invoice)) {

    request.invoice = await invoices.refreshInvoice(String(request.invoice.uid))

  }

  try {

    let isBIP70 = /paymentrequest$/

    let isBIP270 = /bitcoinsv-paymentrequest$/

    let isJsonV2 = /application\/payment-request$/

    let accept = request.headers['accept']

    if (accept && accept.match(/payment-options/)) {

      return listPaymentOptions(request, h)

    } else if (accept && accept.match(isBIP270)) {

      return handleBIP270(request, h)

    } else if (accept && accept.match(isBIP70)) {

      return handleBIP70(request, h)

    } else if (accept && accept.match(isJsonV2)) {

      return handleJsonV2(request, h)

    } else {

      return handleBIP270(request, h)

    }

  } catch(error: any) {

    log.error('pay.request.error', error);

    return badRequest(error.message);

  }

}

function notAuthorized() {
  throw new Error('Function not implemented.');
}

