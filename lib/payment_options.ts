
import { models } from './models';

import {  } from './log';

import { convert } from './prices'

import { toSatoshis } from './plugins'

import { computeInvoiceURI } from './uri'

import {getCoin} from './coins';

import { PaymentRequest } from './payment_requests';

export interface NewPaymentOption {
  invoice_uid: string;
  currency: string;
  address?: string;
  amount?: number;
}

export async function paymentRequestToPaymentOptions(paymentRequest: PaymentRequest) {

  let options = await Promise.all(paymentRequest.get('template').map(async (option) => {

    let outputs = await Promise.all(option.to.map(async (to) => {

      const { currency, chain } = option

      let conversion = await convert({
        currency: to.currency,
        value: parseFloat(to.amount)
      }, option.currency)

      var amount = toSatoshis({decimal: conversion.value, currency, chain})

      return {
        address: to.address,
        amount
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
      chain: option.chain || option.currency,
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
