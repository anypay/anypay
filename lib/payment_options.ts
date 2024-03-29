/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import {  } from './log';

import { convert } from './prices'

import { toSatoshis } from './plugins'

import { computeInvoiceURI } from './uri'

import {getCoin} from './coins';

import {
  PaymentRequests as PaymentRequest,
  payment_options as PaymentOption
} from '@prisma/client';

import prisma from './prisma';

export interface NewPaymentOption {
  invoice_uid: string;
  currency: string;
  address?: string;
  amount?: number;
}

export async function paymentRequestToPaymentOptions(paymentRequest: PaymentRequest): Promise<PaymentOption[]> {

  const template = paymentRequest.template as Array<any> || [] 

  let options = await Promise.all(template.map(async (option) => {

    let outputs = await Promise.all(option.to.map(async (to: {
      address: string;
      currency: string;
      amount: number;
    }) => {

      var { currency, chain } = option

      if (!chain) { chain = currency }

      let conversion = await convert({
        currency: to.currency,
        value: to.amount
      }, option.currency)

      var amount = toSatoshis({decimal: conversion.value, currency, chain})

      return {
        address: to.address,
        amount
      }

    }))

    let uri = await computeInvoiceURI({
      currency: option.currency,
      uid: String(paymentRequest.invoice_uid)
    })

    let coin = getCoin(option.currency)

    return {
      invoice_uid: String(paymentRequest.invoice_uid),
      currency: option.currency,
      chain: option.chain || option.currency,
      outputs,
      currency_name: coin?.name,
      currency_logo_url: coin?.logo_url,
      uri
    }

  }))

  return Promise.all(options.map(option => {

    return prisma.payment_options.create({
      data: {
        ...option,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

  }))

}
