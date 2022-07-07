
import { log } from './log'

import { models } from './models'

import { invoices } from './'

import { paymentRequestToPaymentOptions } from './payment_options'

import { schema } from 'anypay'

export async function createPaymentRequest(app_id: number, template: any, options: any) {

  log.info('pay.request.create', { template, options })

  let { error } = schema.PaymentRequestTemplate.validate(template)

  if (error) {

    log.error('pay.request.create.error', { error })

    throw error

  } else {

    log.info('pay.request.create.template.valid', template)

    let record = await models.PaymentRequest.create({

      app_id,

      template: template,

      status: 'unpaid'

    })

    let invoice = await invoices.createEmptyInvoice(app_id)

    console.log('empty created')

    invoice.currency = template[0].currency

    console.log('empty created after currency')

    if (options) {

      invoice.webhook_url = options.webhook
      invoice.redirect_url = options.redirect
      invoice.secret = options.secret
      invoice.metadata = options.metadata

    }

    console.log('about to save', invoice.toJSON())

    await invoice.save()

    console.log('saved', invoice.toJSON())

    record.invoice_uid = invoice.uid
    record.uri = invoice.uri
    record.uid = invoice.uid
    record.webpage_url = `https://anypay.sv/invoices/${invoice.uid}`
    record.status = 'unpaid'

    await record.save()

    console.log('saved', invoice.toJSON())

    await paymentRequestToPaymentOptions(record)

    log.info('pay.request.created', record.toJSON())

    return {

      uid: record.uid,

      uri: record.uri,

      url: record.webpage_url,

      payment_request: record.toJSON(),

      options: options

    } 

  }

}

