import {plugins} from './plugins';

import { BigNumber } from 'bignumber.js';

import { Account } from './account'

import { Invoice } from './invoices'

import * as moment from 'moment';

import * as pay from './pay';

import * as _ from 'underscore';

import * as database from './database';

import * as http from 'superagent';

import { log } from './log'

import { models } from './models';

import {convert} from './prices';

import {getCoin} from './coins';

import * as shortid from 'shortid'

import { computeInvoiceURI } from './uri';

import { writePaymentOptions, NewPaymentOption } from './payment_options';

import { PaymentOption } from './payment_option';

import {channel} from './amqp';

import { app } from 'anypay'

const anypay = app(process.env.ANYPAY_API_SECRET)

interface Amount {
  currency: string;
  value: number
}

interface InvoiceChangeset {
  accountId: number;
  address: string;
  denominationAmount: Amount;
  invoiceAmount: Amount;
}

import { Address } from './addresses'

async function getNewInvoiceAddress(accountId: number, currency: string, amount): Promise<string> {
  var address;

  address = await plugins.getNewAddress(currency, accountId, amount);

  if (!address) {
    throw new Error(`unable to generate address for ${currency}`);
  }

  return address

};

function applyScalar(invoiceAmount, scalar) {
  let nScalar = new BigNumber(scalar);
  let nAmount = new BigNumber(invoiceAmount.value);

  return Object.assign(invoiceAmount, {
    value: parseFloat(nScalar.times(nAmount).toNumber().toFixed(6))
  });
}

function applyDiscount(invoiceAmount, discountPercent) {
  let nScalar = new BigNumber(1).minus((new BigNumber(discountPercent)).dividedBy(100));
  let nAmount = new BigNumber(invoiceAmount.value);

  return Object.assign(invoiceAmount, {
    value: parseFloat(nScalar.times(nAmount).toNumber().toFixed(6))
  });
}

export async function createEmptyInvoice(app_id: number, uid?: string) {

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
    uri
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

export async function createInvoice(account: Account, amount: number): Promise<any> {

  const account_id = account.get('id')

  log.info('invoices.create', { account_id, amount })

  const uid = shortid.generate();

  var params = {
    denomination_currency: account.get('denomination'),
    denomination_amount: amount,
    currency: account.get('denomination'),
    amount,
    account_id: account.get('id'),
    status: 'unpaid',
    uid,
    uri: computeInvoiceURI({
      currency: 'ANYPAY',
      uid
    })
  }

  var invoice = await models.Invoice.create(params);

  let options = await createPaymentOptions(account.record, invoice)

  return invoice;

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

  return addresses.map(record => new Address(record))

}

export async function createPaymentOptions(account, invoice): Promise<PaymentOption[]> {

  let addresses = await listAvailableAddresses(new Account(account))

  let paymentOptions: PaymentOption[] = await Promise.all(addresses.map(async record => {

    const currency = record.get('currency')

    let coin = getCoin(record.get('currency'))

    const value = invoice.get('amount')

    let { value: amount } = await convert({
      currency: account.denomination,
      value
    }, currency, coin.precision);

    if (record.get('price_scalar')) {
      amount = new BigNumber(amount).times(record.get('price_scalar')).toNumber()
    }

    let address = await getNewInvoiceAddress(account.id, currency, amount);

    let url = computeInvoiceURI({
      currency: currency,
      uid: invoice.uid
    });

    let paymentCoin = getCoin(currency);

    if (address.match(':')) {
      address = address.split(':')[1]
    }

    let fee = await pay.fees.getFee(currency)
    
    var paymentAmount = pay.toSatoshis(amount)

    let outputs = []

    outputs.push({
      address,
      amount: paymentAmount
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

  log.info('invoice.created', {
    account_id: account.id,
    uid: invoice.uid
  });

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

