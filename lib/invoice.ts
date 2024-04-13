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
import { getNewAddress } from './plugins';

import { BigNumber } from 'bignumber.js';

import { accounts as Account } from '@prisma/client'

import moment from 'moment';

import * as pay from './pay';

import * as _ from 'underscore';

import { log } from './log'

import {convert} from './prices';

import {getCoin} from './coins';

import * as shortid from 'shortid'

import { computeInvoiceURI } from './uri';

import { payment_options as PaymentOption } from '@prisma/client';
import { invoices as Invoice } from '@prisma/client';

import { toSatoshis } from './plugins'

import { addresses as Address } from '@prisma/client';
import prisma from './prisma';

interface EmptyInvoiceOptions {
  uid?: string;
  currency?: string;
  amount?: number;
  webhook_url?: string;
  secret?: string;
  metadata?: any;
  memo?: string;
  redirect_url?: string;
}

export async function createEmptyInvoice(app_id: number, options: EmptyInvoiceOptions = {}) {

  var { uid, currency, amount, webhook_url, memo, secret, metadata, redirect_url } = options

  uid = !!uid ? uid : shortid.generate();

  const app = await prisma.apps.findFirstOrThrow({
    where: {
      id: app_id
    }
  })

  if (!app) {
    throw new Error('app not found')
  }

  let uri = computeInvoiceURI({
    currency: 'ANYPAY',
    uid
  })


  const record = await prisma.invoices.create({
    data: {
      app_id,
      account_id: app.account_id,
      uid,
      uri,
      currency,
      amount,
      webhook_url,
      memo,
      secret,
      metadata,
      redirect_url,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'unpaid'
    }
  })

  return record;

}

export async function refreshInvoice(uid: string): Promise<Invoice> {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid
    }
  })

  const paymentOptions = await prisma.payment_options.findMany({
    where: {
      invoice_uid: uid
    }
  })

  const paymentRequest = await prisma.paymentRequests.findFirstOrThrow({
    where: {
      invoice_uid: uid
    }
  })

  for (let option of paymentOptions) {

    const template = (paymentRequest.template as Array<any>)?.find(template => {

      return template.currency === option.currency &&
             (!template.chain || template.chain === option.chain)

    })

    if (!template) {
      continue;
    }

    const outputs = await Promise.all(template.to.map(async (to: { address?: any; currency?: any; amount?: any; }) => {

      const { currency: _currency, amount: value, } = to

      const conversion = await convert({ currency: _currency, value }, option.currency)

      const { currency } = option

      const chain = String(option.chain)

      const amount = toSatoshis({decimal: conversion.value, currency, chain})

      return {

        address: to.address,

        amount

      }

    }))


    const record = await prisma.payment_options.findFirstOrThrow({
      where: {
        invoice_uid: invoice.uid,
        currency: option.currency,
        chain: option.chain
      }
    })

    await prisma.payment_options.update({
      where: {
        id: record.id
      },
      data: {
        outputs
      }
    })

  }

  await prisma.invoices.update({
    where: {
      id: invoice.id
    },
    data: {
      expiry: moment().add(15, 'minutes').toDate()
    }
  
  })

  log.debug('invoice.refreshed', {
    invoice_uid: invoice.uid,
    expiry: invoice.expiry
  })

  return invoice

}

async function listAvailableAddresses(account: Account): Promise<Address[]> {

  const addresses = await prisma.addresses.findMany({
    where: {
      account_id: account.id
    }
  })

  var availableAddresses = addresses.filter((address) => {
    let coin = getCoin(String(address.currency));
    if (!coin) { return false }

    return !coin.unavailable;
  });

  availableAddresses = availableAddresses.map(address => {
    if (!address.chain) { address.chain = address.currency }
    if (!address.currency) { address.currency = address.chain }
    return address
  })

  return availableAddresses

}

// TODO: Only create options from existing options coins if options exist
export async function createPaymentOptions(account: Account, invoice: Invoice): Promise<PaymentOption[]> {

  let addresses: Address[] = await listAvailableAddresses(account)

  let unfilteredOptions: (PaymentOption | null )[] = await Promise.all(addresses.map(async (record: Address) => {

    const chain = String(record.chain);
    const currency = String(record.currency);

    try {

      const value = invoice.amount

      const coin = getCoin(currency)

      let { value: amount } = await convert({
        currency: String(account.denomination),
        value: Number(value)
      }, currency, Number(coin?.precision));

      let address = await getNewAddress({ account, address: record, currency, chain })

      if (!address) { return null }

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      var paymentAmount = toSatoshis({ decimal: amount, currency, chain })

      let outputs = []

      let fee = await pay.fees.getFee(String(currency), paymentAmount)

      if (!['MATIC', 'ETH', 'AVAX'].includes(String(chain))) { // multiple outputs disallowed

        paymentAmount = new BigNumber(paymentAmount).minus(fee.amount).toNumber();

        outputs.push({
          address,
          amount: paymentAmount
        })

        outputs.push({
          address: fee.address,
          amount: fee.amount
        })

      } else {

        outputs.push({
          address,
          amount: paymentAmount
        })

      }

      let uri = computeInvoiceURI({
        currency: String(currency),
        uid: invoice.uid || ''
      });

      amount = outputs.reduce((sum, output) => {

        return sum.plus(output.amount)

      }, new BigNumber(0)).toNumber()

      const optionRecord = await prisma.payment_options.create({
        data: {
          invoice_uid: invoice.uid,
          currency,
          chain,
          amount,
          address,
          outputs,
          uri,
          fee: fee.amount,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return optionRecord

    } catch(error) {

      console.error('create payment option error---', error)

      return null

    }

  }));

  const paymentOptions: PaymentOption[] = unfilteredOptions.filter(option => !!option) as PaymentOption[]

  return paymentOptions
}

export function isExpired(invoice: Invoice) {

  let expiry = moment(invoice.expiry);  
  let now = moment()

  return now > expiry;
}

export async function ensureInvoice(uid: string): Promise<any> {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid
    }
  })

  if (!invoice) {
    throw  new Error(`invoice ${uid} not found`)
  }

  return invoice;

}

