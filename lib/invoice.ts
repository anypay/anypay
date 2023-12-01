import { getNewAddress } from './plugins';

import { BigNumber } from 'bignumber.js';

import { Account } from './account'

import * as moment from 'moment';

import * as pay from './pay';

import * as _ from 'underscore';

import { log } from './log'

import { models } from './models';

import {convert} from './prices';

import {getCoin} from './coins';

import * as shortid from 'shortid'

import { computeInvoiceURI } from './uri';

import { PaymentOption } from './payment_option';
import { findAll, findOne } from './orm';
import { PaymentRequest } from './payment_requests';
import { Invoice } from './invoices';

import { toSatoshis } from './plugins'

import { Address } from './addresses';

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

  let app = await models.App.findOne({ where: { id: app_id }})

  if (!app) {
    throw new Error('app not found')
  }

  let uri = computeInvoiceURI({
    currency: 'ANYPAY',
    uid
  })

  let record = await models.Invoice.create({
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
    redirect_url
  })

  return record;

}

export async function refreshInvoice(uid: string): Promise<Invoice> {

  let invoice = await models.Invoice.findOne({ where: { uid }})

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

    const template = paymentRequest.get('template').find(template => {

      return template.currency === option.get('currency') &&
             (!template.chain || template.chain === option.get('chain'))

    })

    if (!template) {
      return
    }

    const outputs = await Promise.all(template.to.map(async (to) => {

      const { currency: _currency, amount: value } = to

      const conversion = await convert({ currency: _currency, value }, option.get('currency'))

      const { currency, chain } = option

      const amount = toSatoshis({decimal: conversion.value, currency, chain})

      return {

        address: to.address,

        amount

      }

    }))

    const record = await models.PaymentOption.findOne({
      where: {
        invoice_uid: invoice.uid,
        currency: option.get('currency'),
        chain: option.get('chain')
      }
    })

    record.outputs = outputs

    await record.save()

  }

  await invoice.set('expiry', moment().add(15, 'minutes').toDate())

  log.debug('invoice.refreshed', {
    invoice_uid: invoice.uid,
    expiry: invoice.expiry
  })

  return invoice

}

async function listAvailableAddresses(account: Account): Promise<Address[]> {

  let addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  let availableAddresses = _.reject(addresses, (address) => {
    let coin = getCoin(address.currency);
    if (!coin) { return true }

    return coin.unavailable;
  });

  availableAddresses = availableAddresses.map(address => {
    if (!address.chain) { address.chain = address.currency }
    if (!address.currency) { address.currency = address.chain }
    return address
  })

  return availableAddresses.map(record => new Address(record))

}

// TODO: Only create options from existing options coins if options exist
export async function createPaymentOptions(account, invoice): Promise<PaymentOption[]> {

  let addresses: Address[] = await listAvailableAddresses(new Account(account))

  let paymentOptions: PaymentOption[] = await Promise.all(addresses.map(async (record: Address) => {

    const {chain, currency } = record

    try {

      const value = invoice.get('amount')

      const coin = getCoin(currency)

      let { value: amount } = await convert({
        currency: account.denomination,
        value
      }, currency, coin.precision);

      let address = await getNewAddress({ account, address: record, currency, chain })

      if (!address) { return }

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      var paymentAmount = toSatoshis({ decimal: amount, currency, chain })

      let outputs = []

      let fee = await pay.fees.getFee({ chain, currency, amount: paymentAmount})

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

      let optionRecord = await models.PaymentOption.create({
        invoice_uid: invoice.uid,
        currency,
        chain,
        amount,
        address,
        outputs,
        uri,
        fee: fee.amount
      })

      if (!optionRecord){
        console.error('no payment option record created', {currency,chain,amount,address,uid:invoice.uid,outputs,uri})
        throw new Error('no payment option record created')
        return null
      }

      return new PaymentOption(optionRecord)

    } catch(error) {

      console.error('create payment option error---', error)

      return null

    }

  }));

  return paymentOptions.filter(option => !!option && !!option.record)
}

export function isExpired(invoice) {

  let expiry = moment(invoice.expiry);  
  let now = moment()

  return now > expiry;
}

export async function ensureInvoice(uid: string): Promise<any> {

  let invoice = await models.Invoice.findOne({ where: { uid }});

  if (!invoice) {
    throw  new Error(`invoice ${uid} not found`)
  }

  return invoice;

}

