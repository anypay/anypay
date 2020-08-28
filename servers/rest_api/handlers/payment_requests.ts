
import { log, models, invoices } from '../../../lib';

import * as Boom from 'boom';

import { show as handleBIP70 } from './bip70_payment_requests'
import { show as handleJsonV2 } from './json_payment_requests'
import { show as handleBIP270 } from './bip270_payment_requests'

import { schema } from 'anypay'

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

      record.invoice_uid = invoice.uid
      record.uri = invoice.uri
      record.webpage_url = `https://app.anypayinc.com/invoices/${invoice.uid}`
      record.status = 'unpaid'

      await record.save()

      log.info('pay.request.created', record.toJSON())

      return {

        payment_request: record.toJSON()

      } 

    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  log.info('pay.request.show', { uid: req.params.uid, headers: req.headers })

  try {

    let isBIP70 = /paymentrequest$/
    let isJsonV2 = /application\/payment-request$/

    let accept = req.headers['accept']

    if (accept && accept.match(isBIP70)) {

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

