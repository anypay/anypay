
import { log } from './log'

import { models } from './models'

import { invoices } from './'

import { paymentRequestToPaymentOptions } from './payment_options'

import { schema } from 'anypay'

import BigNumber from 'bignumber.js'

function ensureConsistentCurrencyAmount(template: any): {currency: string, amount: number} {

  var currency, amount = new BigNumber(0);

  for (let option of template) {

    for (let to of option.to) {

      if (!currency) {

        currency = to.currency

        amount = amount.plus(to.amount)

      }

      if (currency !== to.currency) {

        throw new Error('all template options to.currency must equal the same value')

      }

    }

  }

  return {currency, amount: amount.toNumber()}

}

export async function createPaymentRequest(app_id: number, template: any, options: any) {

  log.info('pay.request.create', { template, options })

  const { currency, amount } = ensureConsistentCurrencyAmount(template)

  let { error } = schema.PaymentRequestTemplate.validate(template)

  if (error) {

    log.error('pay.request.create.error', error)

    throw error

  } else {

    log.info('pay.request.create.template.valid', template)

    let record = await models.PaymentRequest.create({

      app_id,

      template: template,

      status: 'unpaid'

    })

    let invoice = await invoices.createEmptyInvoice(app_id, { currency, amount })

    invoice.currency = template[0].currency

    if (options) {

      invoice.webhook_url = options.webhook
      invoice.redirect_url = options.redirect
      invoice.secret = options.secret
      invoice.metadata = options.metadata

    }

    await invoice.save()

    record.invoice_uid = invoice.uid
    record.uri = invoice.uri
    record.uid = invoice.uid
    record.webpage_url = `https://anypay.sv/invoices/${invoice.uid}`
    record.status = 'unpaid'

    await record.save()

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

