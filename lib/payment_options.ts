
import { models } from './models';
import { log } from './logger';

import { convert } from './prices'
import { toSatoshis } from './pay'
import { computeInvoiceURI } from './uri'
import {getCoin} from './coins';

export interface NewPaymentOption {
  invoice_uid: string;
  currency: string;
  address?: string;
  amount?: number;
}

export function writePaymentOptions(options: NewPaymentOption[]) {

  log.info('writepaymentoptions', {options});

  return Promise.all(options.map(option => {

    return models.PaymentOption.create(option);

  }))

}


export async function paymentRequestToPaymentOptions(paymentRequest) {

  let options = await Promise.all(paymentRequest.template.map(async (option) => {

    let outputs = await Promise.all(option.to.map(async (to) => {

      let conversion = await convert({
        currency: to.currency,
        value: to.amount
      }, option.currency)

      return {
        address: to.address,
        amount: toSatoshis(conversion.value)
      }

    }))

    let uri = await computeInvoiceURI({
      currency: option.currency,
      uid: paymentRequest.invoice_uid
    })

    let coin = getCoin(option.currency)

    return {
      invoice_uid: paymentRequest.invoice_uid,
      currency: option.currency,
      outputs,
      currency_name: coin.name,
      currency_logo_url: coin.logo_url,
      uri
    }

  }))

  return Promise.all(options.map(option => {

    return models.PaymentOption.create(option)

  }))

}
