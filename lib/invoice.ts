import { getNewAddress } from './plugins';

import { BigNumber } from 'bignumber.js';

import { addresses, invoices, payment_options } from '@prisma/client'

import moment from 'moment';

import * as pay from './pay';

import * as _ from 'underscore';

import { log } from './log'

import {convert} from './prices';

import {getCoin} from './coins';

import { nanoid } from 'nanoid'

import { computeInvoiceURI } from './uri';

import { PaymentOption } from './payment_option';

import { findAll, findOne } from './orm';

import { PaymentRequest } from './payment_requests';

import { toSatoshis } from './plugins'

import { accounts } from '@prisma/client';

import { prisma } from './prisma';

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

export async function createEmptyInvoice(app_id: number, options: EmptyInvoiceOptions = {}): Promise<invoices> {

  var { uid, currency, amount, webhook_url, memo, secret, metadata, redirect_url } = options

  uid = !!uid ? uid : nanoid(12);

  const app = await prisma.apps.findFirst({ where: { id: app_id }})

  if (!app) {
    throw new Error('app not found')
  }

  let uri = computeInvoiceURI({
    currency: 'ANYPAY',
    uid
  })

  return prisma.invoices.create({
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
      updatedAt: new Date()
    }
  })
}

export async function refreshInvoice(uid: string): Promise<invoices> {

  const invoice = await prisma.invoices.findFirst({
    where: {
      uid
    }
  })

  const paymentOptions: PaymentOption[] = await findAll<PaymentOption>(PaymentOption, {
    where: {
      invoice_uid: uid
    }
  })

  const paymentRequest: PaymentRequest = await findOne<PaymentRequest>(PaymentRequest, {

    where: {

      invoice_uid: invoice.uid
    }
  })

  for (let option of paymentOptions) {

    const template = paymentRequest.get('template').find((template: { currency: any; chain: any; }) => {

      return template.currency === option.get('currency') &&
             (!template.chain || template.chain === option.get('chain'))

    })

    if (!template) {
      return
    }

    const outputs = await Promise.all(template.to.map(async (to: { address?: any; currency?: any; amount?: any; }) => {

      const { currency: _currency, amount: value } = to

      const conversion = await convert({ currency: _currency, value }, option.get('currency'))

      const { currency, chain } = option

      const amount = toSatoshis({decimal: conversion.value, currency, chain})

      return {

        address: to.address,

        amount

      }

    }))

    const paymentOption = await prisma.payment_options.findFirst({
      where: {
        invoice_uid: invoice.uid,
        currency: option.get('currency'),
        chain: option.get('chain')
      }
    })

    await prisma.payment_options.update({
      where: {
        id: paymentOption.id
      },
      data: {
        outputs
      }
    })

    return invoice

  }

  await prisma.invoices.update({
    where: {
      id: invoice.id
    },
    data: {
      expiry:  moment().add(15, 'minutes').toDate()
    }
  })

  log.debug('invoice.refreshed', {
    invoice_uid: invoice.uid,
    expiry: invoice.expiry
  })

  return invoice

}

async function listAvailableAddresses(account: accounts): Promise<addresses[]> {

  const addresses = await prisma.addresses.findMany({
    where: {
      account_id: account.id
    }
  })

  return _.reject(addresses, (address) => {
    let coin = getCoin(address.currency);
    if (!coin) { return true }

    return coin.unavailable;
  })
  .map(address => {
    if (!address.chain) { address.chain = address.currency }
    if (!address.currency) { address.currency = address.chain }
    return address
  })

}

// TODO: Only create options from existing options coins if options exist
export async function createPaymentOptions(account: accounts, invoice: invoices): Promise<payment_options[]> {

  let addresses: addresses[] = await listAvailableAddresses(account)

  let paymentOptions: payment_options[] = await Promise.all(addresses.map(async (record: addresses) => {

    const {chain, currency } = record

    try {

      const value = invoice.amount

      const coin = getCoin(currency)

      let { value: amount } = await convert({
        currency: account.denomination,
        value: Number(value)
      }, currency, coin.precision);

      let address = await getNewAddress({ account, address: record, currency, chain })

      if (!address) { return }

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      var paymentAmount = toSatoshis({ decimal: amount, currency, chain })

      let outputs = []

      let fee = await pay.fees.getFee(currency, paymentAmount)

      if (!['MATIC', 'ETH', 'AVAX'].includes(chain)) { // multiple outputs disallowed

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
        currency: currency,
        uid: invoice.uid
      });

      amount = outputs.reduce((sum, output) => {

        return sum.plus(output.amount)

      }, new BigNumber(0)).toNumber()

      return prisma.payment_options.create({
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

    } catch(error) {

      console.error('create payment option error---', error)

      return null

    }

  }));

  return paymentOptions.filter(option => !!option)
}

export function isExpired(invoice: invoices) {

  let expiry = moment(invoice.expiry);  
  let now = moment()

  return now > expiry;
}

export async function ensureInvoice(uid: string): Promise<any> {

  return prisma.invoices.findFirstOrThrow({
    where: {
      uid
    }
  })

}
