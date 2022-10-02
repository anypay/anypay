
import { log } from './log'

import { models } from './models'

import { invoices } from './'

import { paymentRequestToPaymentOptions } from './payment_options'

import { schema } from 'anypay'

import BigNumber from 'bignumber.js'

import { create, Orm } from './orm'

export class PaymentRequest extends Orm {

  static model = models.PaymentRequest

  get invoice_uid() {

    return this.get('invoice_uid')

  }

}

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

interface PaymentRequestOptions {
  webhook_url?: string;
  redirect_url?: string;
  memo?: string;
  secret?: string;
  metadata?: any;
}

export async function createPaymentRequest(app_id: number, template: any, options: PaymentRequestOptions = {}): Promise<PaymentRequest> {

  log.info('pay.request.create', { template, options })

  const { currency, amount } = ensureConsistentCurrencyAmount(template)

  let { error } = schema.PaymentRequestTemplate.validate(template)

  if (error) {

    log.error('pay.request.create.error', error)

    throw error

  } else {

    log.info('pay.request.create.template.valid', template)

    let paymentRequest = await create<PaymentRequest>(PaymentRequest, {

      app_id,

      template: template,

      options,

      status: 'unpaid'

    })

    let invoice = await invoices.createEmptyInvoice(app_id, { currency, amount })

    if (template.length === 1) {

      invoice.currency = template[0].currency

    }

    if (options) {

      invoice.webhook_url = options.webhook_url

      invoice.redirect_url = options.redirect_url

      invoice.secret = options.secret

      invoice.metadata = options.metadata

    }

    await invoice.save()

    await paymentRequest.update({

      invoice_uid: invoice.uid,

      uri: invoice.uri,

      uid: invoice.uid,

      webpage_url: `https://anypay.sv/invoices/${invoice.uid}`,

      status: 'unpaid'
      
    })

    await paymentRequestToPaymentOptions(paymentRequest)

    log.info('pay.request.created', paymentRequest.toJSON())

    return paymentRequest;

  }

}
