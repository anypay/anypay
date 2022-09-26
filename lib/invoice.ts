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

import { Invoice } from './invoices'

interface Address {
  currency: string,
  value: string
}

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

export async function createEmptyInvoice(app_id: number, options: EmptyInvoiceOptions = {}): Promise<Invoice> {

  var { uid, currency, amount, webhook_url, memo, secret, metadata, redirect_url } = options

  uid = !!uid ? uid : shortid.generate();

  amount = amount || 0

  let app = await models.App.findOne({ where: { id: app_id }})

  if (!app) {
    throw new Error('app not found')
  }

  let uri = computeInvoiceURI({
    currency: 'ANYPAY',
    uid
  })

  const record = await models.Invoice.create({
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

  return new Invoice(record)

}

export async function refreshInvoice(uid: string): Promise<any> {

  let invoice = await models.Invoice.findOne({ where: { uid }})

  let paymentOptions = await models.PaymentOption.findAll({
    where: {
      invoice_uid: uid
    }
  })

  // delete all payment options and re-generate invoice
  await Promise.all(paymentOptions.map(option => option.destroy()))

  let account = await models.Account.findOne({ where: { id: invoice.account_id }})


  // TODO: Only create options from existing options coins if options exist
  await createPaymentOptions(account, invoice)

  invoice.expiry = moment().add(15, 'minutes').toDate();

  await invoice.save()

  log.info('invoice.refreshed', {
    invoice_uid: invoice.uid
  })

  return invoice

}

async function listAvailableAddresses(account: Account): Promise<Address[]> {

  let addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  addresses = _.reject(addresses, (address) => {
    let coin = getCoin(address.currency);
    if (!coin) { return true }

    return coin.unavailable;
  });

  return addresses

}

interface GetAddressResult {
  address: string;
  tag?: number;
  payment_id?: string;
}

async function getAddress(account: Account, currency: string): Promise<GetAddressResult> {

  let address = await models.Address.findOne({ where: {
    account_id: account.id,
    currency
  }});

  if (!address) {
    throw new Error('address not found')
  }

  return {

    address: address.value
    
  }

}

// TODO: Only create options from existing options coins if options exist
export async function createPaymentOptions(account: Account, invoice: Invoice): Promise<PaymentOption[]> {

  let addresses = await listAvailableAddresses(account)

  let paymentOptions: PaymentOption[] = await Promise.all(addresses.map(async record => {

    const currency = record.currency

    let coin = getCoin(record.currency)

    const value = invoice.get('amount')

    let { value: amount } = await convert({
      currency: account.denomination,
      value
    }, currency, coin.precision);

    let { address } = await getAddress(account, currency)

    let paymentCoin = getCoin(currency);

    if (address.match(':')) {
      address = address.split(':')[1]
    }

    var paymentAmount = pay.toSatoshis(amount, currency)

    let fee = await pay.fees.getFee(currency, paymentAmount)

    paymentAmount = new BigNumber(paymentAmount).minus(fee.amount).toNumber();

    let outputs = []

    outputs.push({
      address,
      amount: paymentAmount
    })

    outputs.push({
      address: fee.address,
      amount: fee.amount
    })

    let uri = computeInvoiceURI({
      currency: currency,
      uid: invoice.uid
    });

    amount = outputs.reduce((sum, output) => {

      return sum.plus(output.amount)

    }, new BigNumber(0)).toNumber()

    let optionRecord = await models.PaymentOption.create({
      currency_name: paymentCoin.name,
      invoice_uid: invoice.uid,
      currency,
      amount,
      address,
      outputs,
      uri,
      fee: fee.amount
    })

    return new PaymentOption(invoice, optionRecord)

  }));

  return paymentOptions
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

