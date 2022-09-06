import {plugins} from './plugins';

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

interface Address {
  currency: string,
  value: string
}

async function getNewInvoiceAddress(accountId: number, currency: string, amount): Promise<Address> {
  var address;

  address = await plugins.getNewAddress(currency, accountId, amount);

  if (!address) {
    throw new Error(`unable to generate address for ${currency}`);
  }

  return {
    currency,
    value: address
  }

};

interface EmptyInvoiceOptions {
  uid?: string;
  currency?: string;
  amount?: number
}

export async function createEmptyInvoice(app_id: number, options: EmptyInvoiceOptions = {}) {

  var { uid, currency, amount } = options

  uid = !!uid ? uid : shortid.generate();

  let app = await models.App.findOne({ where: { id: app_id }})

  if (!app) {
    throw new Error('app not found')
  }

  let uri = computeInvoiceURI({
    currency: 'ANYPAY',
    uid
  })

  return models.Invoice.create({
    app_id,
    account_id: app.account_id,
    uid,
    uri,
    currency,
    amount
  })

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

  await createPaymentOptions(account, invoice)

  invoice.expiry = moment().add(15, 'minutes').toDate();

  await invoice.save()

  log.info('invoice.refreshed', invoice.toJSON())

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

export async function createPaymentOptions(account, invoice): Promise<PaymentOption[]> {

  let addresses = await listAvailableAddresses(new Account(account))

  let paymentOptions: PaymentOption[] = await Promise.all(addresses.map(async record => {

    const currency = record.currency

    let coin = getCoin(record.currency)

    const value = invoice.get('amount')

    let { value: amount } = await convert({
      currency: account.denomination,
      value
    }, currency, coin.precision);

    let address = (await getNewInvoiceAddress(account.id, currency, amount)).value;

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

