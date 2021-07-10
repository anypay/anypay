
import { log, models, invoices } from '../../../lib';
import { logInfo } from '../../../lib/logger' 

import * as Boom from 'boom';

import { show as handleBIP70 } from './bip70_payment_requests'
import { show as handleJsonV2 } from './json_payment_requests'
import { show as handleBIP270 } from './bip270_payment_requests'

import { paymentRequestToPaymentOptions } from '../../../lib/payment_options'

import { schema } from 'anypay'

function upcase(str) {

  if (!str) {
    return null
  }

  return str.toUpperCase()

}

export async function createBeta(req, h) {

  /* 

    Create payment request. Does not require access token. Will accept either a single Payment struct or an Array of
    Payment structs.

    [{
      coin: 'BSV',
      currency: 'CAD',
      amount: 15.99,
      address: '1Dn4dU42sjV5UXQPfHwxY187DoQAwRkyga'
    }]

  */

  if (req.payload.template) {
    return create(req, h)
  }

  var template;

  if (Array.isArray(req.payload)) {

    template = {
      currency: upcase(req.params.currency) || 'BSV',

      to: req.payload
    }


  } else {

    template = {
      currency: upcase(req.params.currency) || 'BSV',

      to: [req.payload]
    }

  }

}

export async function create(req, h) {

  try {

    logInfo('pay.request.create', { template: req.payload.template, options: req.payload.options })

    let { error, template } = schema.PaymentRequestTemplate.validate(req.payload.template)

    if (error) {

      log.error('pay.request.create.error', { error })

      throw error

    } else {

      logInfo('pay.request.create.template.valid', template)

      let record = await models.PaymentRequest.create({

        app_id: req.app_id,

        template: req.payload.template,

        status: 'unpaid'

      })

      let invoice = await invoices.createEmptyInvoice(req.app_id)

      invoice.currency = req.payload.template[0].currency

      if (req.payload.options) {

        invoice.webhook_url = req.payload.options.webhook
        invoice.redirect_url = req.payload.options.redirect
        invoice.secret = req.payload.options.secret
        invoice.metadata = req.payload.options.metadata

      }

      await invoice.save()

      record.invoice_uid = invoice.uid
      record.uri = invoice.uri
      record.webpage_url = `https://app.anypayinc.com/invoices/${invoice.uid}`
      record.status = 'unpaid'

      await record.save()

      await paymentRequestToPaymentOptions(record)

      logInfo('pay.request.created', record.toJSON())

      return {

        uid: record.uid,

        uri: record.uri,

        url: record.webpage_url,

        payment_request: record.toJSON()

        //options: req.payload.options

      } 

    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  logInfo('pay.request.show', { uid: req.params.uid, headers: req.headers })

  let invoice = await models.Invoice.findOne({ where: { uid: req.params.uid }})

  if (invoice.cancelled) {
    return Boom.badRequest('invoice cancelled')
  }

  if (invoice.status === 'unpaid' && invoices.isExpired(invoice)) {

    invoice = await invoices.refreshInvoice(invoice.uid)

  } else {

    log.info('invoice not yet expired');
  }

  try {

    let isBIP70 = /paymentrequest$/
    let isBIP270 = /bitcoinsv-paymentrequest$/
    let isJsonV2 = /application\/payment-request$/

    let accept = req.headers['accept']

    if (accept && accept.match(isBIP270)) {

      return handleBIP270(req, h)

    } if (accept && accept.match(isBIP70)) {

      return handleBIP70(req, h)

    } else if (accept && accept.match(isJsonV2)) {

      return handleJsonV2(req, h)

    } else {

      return handleBIP270(req, h)

    }

  } catch(error) {

    log.error('pay.request.error', { error: error.message });

    return Boom.badRequest(error.message);

  }

}

