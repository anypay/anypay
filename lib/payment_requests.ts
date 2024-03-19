
import { log } from './log'

import { invoices } from './'

import { paymentRequestToPaymentOptions } from './payment_options'

import { schema } from 'anypay'

import BigNumber from 'bignumber.js'

import {
  PaymentRequests as PaymentRequest
} from '@prisma/client'
import prisma from './prisma'

//type PaymentRequestTemplate = any;

/*export interface PaymentRequest {
  app_id: number;
  template: PaymentRequestTemplate;
  status: string;
  invoice_uid?: string;
  uri?: string;
  webpage_url?: string;
}
*/

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

    let paymentRequest = await prisma.paymentRequests.create({
      data: {
        app_id,
        template: template,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    let invoice = await invoices.createEmptyInvoice(app_id, { currency, amount })

    if (template.length === 1) {

      invoice.currency = template[0].currency

    }

    if (options) {

      await prisma.invoices.update({
        where: { id: invoice.id },
        data: {
          webhook_url: options.webhook_url,
          redirect_url: options.redirect_url,
          secret: options.secret,
          metadata: options.metadata
        }
      })

    }

    await prisma.paymentRequests.update({
      where: { id: paymentRequest.id },
      data: {
        invoice_uid: invoice.uid,
        uri: invoice.uri,
        webpage_url: `https://anypayx.com/i/${invoice.uid}`,
        status: 'unpaid',
        updatedAt: new Date()        
      }
    })


    await paymentRequestToPaymentOptions(paymentRequest)

    log.info('pay.request.created', paymentRequest)

    return paymentRequest;

  }

}
