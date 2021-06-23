
import { log, models, invoices } from '../../../lib';

import * as Boom from 'boom';

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

    log.info('pay.request.create', { template: req.payload.template, options: req.payload.options })

    let { error, template } = schema.PaymentRequestTemplate.validate(req.payload.template)

    if (error) {

      log.error('pay.request.create.error', { error })

      throw error

    } else {

      log.info('pay.request.create.template.valid', template)

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

      log.info('pay.request.created', record.toJSON())

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

