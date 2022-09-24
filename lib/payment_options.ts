
import { models } from './models';
import { log } from './log';

import { convert } from './prices'
import { toSatoshis } from './pay'
import { computeInvoiceURI } from './uri'
import {getCoin} from './coins';

import { BigNumber } from 'bignumber.js'
import { Invoice } from './invoices';
import { PaymentOption } from './payment_option';

import { PaymentRequest } from './payment_requests';

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

export class PaymenOptionNotFoundError extends Error {}

export async function ensurePaymentOption(invoice: Invoice, currency: string): Promise<PaymentOption> {

  const record = await models.PaymentOption.findOne({ where: {
    invoice_uid: invoice.get("uid"),
    currency
  }})

  console.log('OPTION ENSURED?', record)
  
  if (!record) {
  
    throw new PaymenOptionNotFoundError()
  
  }

  return new PaymentOption(invoice, record)
  
}


export async function paymentRequestToPaymentOptions(paymentRequest: PaymentRequest) {

  let options = await Promise.all(paymentRequest.get('template').map(async (option) => {

    let outputs = await Promise.all(option.to.map(async (to) => {

      console.log({ to })

      let conversion = await convert({
        currency: to.currency,
        value: parseFloat(to.amount)
      }, option.currency)

      var amount = toSatoshis(conversion.value)

      if (to.currency === 'XMR') {

        amount = new BigNumber(amount).times(10000).toNumber()

      }

      return {
        address: to.address,
        amount: toSatoshis(conversion.value)
      }

    }))

    let uri = await computeInvoiceURI({
      currency: option.currency,
      uid: paymentRequest.get('invoice_uid')
    })

    let coin = getCoin(option.currency)

    return {
      invoice_uid: paymentRequest.get('invoice_uid'),
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
