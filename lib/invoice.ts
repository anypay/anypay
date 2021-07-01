import {plugins} from './plugins';

import { getAmbassadorAccount } from './ambassadors';

import { BigNumber } from 'bignumber.js';
import * as moment from 'moment';

import * as pay from './pay';

import * as _ from 'underscore';

import { createAddressRoute } from './routes';

import * as database from './database';

import { Payment } from '../types/interfaces';

import * as http from 'superagent';

import {emitter} from './events'

import { log, logInfo } from './logger'

import { models } from './models';

import {convert} from './prices';

import {getCoin} from './coins';

import * as shortid from 'shortid'

import { computeInvoiceURI } from './uri';

import { writePaymentOptions, PaymentOption } from './payment_options';

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

interface Address {
  currency: string,
  value: string
}

async function getNewInvoiceAddress(accountId: number, currency: string): Promise<Address> {
  var address;

  address = await plugins.getNewAddress(currency, accountId);

  if (!address) {
    throw new Error(`unable to generate address for ${currency}`);
  }

  return {
    currency,
    value: address
  }

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

class ClassicInvoice {

  template: any

  addresses: any[]

  params: any

  constructor(params) {
    this.params = params
  }

  async applyScalar() {

  }

  async applyCashback() {

  }

  async applyAffiliate() {

  }

  async getTemplate() {

    return this.template;

  }
}

export async function createPlatformInvoice(account_id, amount, currency) {

  // invoice amount 

  // times scalar

  let platformInvoice = new ClassicInvoice({ account_id, currency, amount })

  await platformInvoice.applyScalar()

  await platformInvoice.applyCashback()

  await platformInvoice.applyAffiliate()

  let template = await platformInvoice.getTemplate()

  let request = await anypay.request(template)

  let invoice = await models.Invoice.findOne({ where: {

    uid: request.uid

  }})

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

export async function generateInvoice(

  accountId: number,
  denominationAmountValue: number,
  invoiceCurrency: string,
  uid?: string

): Promise<any> {

  log.info('invoices.generate', { accountId, denominationAmountValue, invoiceCurrency, uid })

  uid = !!uid ? uid : shortid.generate();

  var account = await models.Account.findOne({ where: { id: accountId }});

  log.info({ account })


  var invoiceParams = {
    denomination_currency: account.denomination,
    denomination_amount: denominationAmountValue,
    currency: account.denomination,
    amount: denominationAmountValue,
    account_id: account.id,
    status: 'unpaid',
    uid,
    uri: computeInvoiceURI({
      currency: 'ANYPAY',
      uid
    }),
    should_settle: account.should_settle
  }

  var invoice = await models.Invoice.create(invoiceParams);

  await createPaymentOptions(account, invoice)

  return invoice;

}

export function buildPaymentOptionsMatrix(addresses, invoiceAmounts, newAddresses, invoice) {

  let matrix = _.zip(addresses, invoiceAmounts, newAddresses)

  let uris = matrix.map((row) => {
    let address = row[0];

    return  computeInvoiceURI({
      currency: address.currency,
      uid: invoice.uid
    });
  });

  matrix = matrix.map((row, i) => {

    row.push(uris[i]);

    return row;
  });

  return matrix

}

export async function createPaymentOptions(account, invoice) {

  let addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  addresses = _.reject(addresses, (address) => {
    let coin = getCoin(address.currency);
    if (!coin) { return true }
    if (!coin) { return true }
    return coin.unavailable;
  });

  let newAddresses = await Promise.all(addresses.map(async (address:any) => {
    let newAddress = await getNewInvoiceAddress(account.id, address.currency);
    return {
      currency: address.currency,
      address: newAddress.value
    }
  }));

  let invoiceAmounts = await Promise.all(addresses.map(async (address) => {

    let coin = getCoin(address.currency);

    let conversion = await convert({
      currency: account.denomination,
      value: invoice.denomination_amount
    }, address.currency, coin.precision);

    if (address.price_scalar) {
      conversion = applyScalar(conversion, address.price_scalar);
    }
    let discount = await models.Discount.findOne({
      where: {
        account_id: account.id,
        currency: address.currency
      }
    })
    if (discount) {
      logInfo('discount.apply', Object.assign(conversion, {percent: discount.percent}))
      conversion = applyDiscount(conversion, discount.percent);
    }

    return conversion;

  }));

  let matrix = buildPaymentOptionsMatrix(addresses, invoiceAmounts, newAddresses, invoice)

  let ambassador = await getAmbassadorAccount(account.ambassador_id)

  log.info({ event: 'ambassador.found', ambassador})

  let paymentOptions: any[] = await Promise.all(matrix.map(async (row) => {

    let currency = row[0].currency;

    let paymentCoin = getCoin(currency);

    let fee = await pay.fees.getFee(currency)

    var address = row[2].address;

    if (address.match(':')) {
      address = address.split(':')[1]
    }

    var address = row[2].address;
    
    if (address.match(':')) {
      address = address.split(':')[1]
    }

    var amount = new BigNumber(pay.toSatoshis(row[1].value)).minus(fee.amount).toNumber();
    if (currency === 'BTC') {
      amount = new BigNumber(pay.toSatoshis(row[1].value)).toNumber();
    }

    let outputs = []

    if (ambassador && currency != 'BTC') {

      let record = await models.Address.findOne({ where: {
        account_id: ambassador.id,
        currency
      }})

      if (record) {

        // ambassador has corresponding address set

        var ambassadorAmount;

        if (account.ambassador_percent > 0) {

          let scalar = new BigNumber(account.ambassador_percent).dividedBy(100)

          if (account.customer_pays_ambassador) {

            ambassadorAmount = parseInt(new BigNumber(amount).times(scalar).toNumber().toFixed(0))

          } else {

            // merchant pays ambassador

            ambassadorAmount = parseInt(new BigNumber(amount).times(scalar).toNumber().toFixed(0))
            amount = new BigNumber(amount).minus(ambassadorAmount).toNumber()

          }

          ambassadorAmount = parseInt(new BigNumber(amount).times(scalar).toNumber().toFixed(0))

          outputs.push({
            address: record.value,
            amount: ambassadorAmount
          })

        }
        
      }

    }

    outputs.push({
      address,
      amount
    })

    if (currency != 'BTC') {
      outputs.push(fee)
    }

    return {
      currency_logo_url: paymentCoin.logo_url,
      currency_name: paymentCoin.name,
      invoice_uid: invoice.uid,
      currency,
      amount: pay.fromSatoshis(amount),
      address,
      outputs,
      uri: row[3],
      fee: fee.amount
    }
  }));

  let paymentOptionRecords = await writePaymentOptions(paymentOptions);

  emitter.emit('invoice.created', invoice.uid);

  await Promise.all(paymentOptions.map(option => {

    return createAddressRoute({
      account_id: account.id,
      address: option.address,
      currency: option.currency
    });
  }))

}

/*

  Function to mark invoice as paid, accepts an Invoice model record, and a
  Payment struct.

  Called after the settlement payment has already been sent

  Emits an event `invoice.settled`

*/

export async function settleInvoice(invoice, settlementPayment: Payment) {

  invoice.output_hash = settlementPayment.hash;
  invoice.output_amount = settlementPayment.amount;
  invoice.output_address = settlementPayment.address;
  invoice.output_currency = settlementPayment.currency;

  await invoice.save();

  emitter.emit('invoice.settled', invoice.toJSON());

  return invoice;

}

export async function replaceInvoice(uid: string, currency: string) {

  let invoice = await models.Invoice.findOne({ where: { uid: uid }});

  let option = await models.PaymentOption.findOne({ 
    where: { 
      invoice_uid: uid,
      currency: currency
     }
  });

  if (!invoice) {
    throw new Error(`invoice ${uid} not found`);
  }

  if (!option) {
    throw new Error(`currency ${currency} is not a payment option for invoice ${uid}`);
  }

  log.info('replace with payment option', option.toJSON());

  invoice.currency = option.currency;
  invoice.invoice_currency = option.currency;

  invoice.amount = option.amount;
  invoice.invoice_amount = option.amount;

  invoice.address = option.address;

  invoice.uri = option.uri;
  
  await invoice.save();

  return invoice;

}

export async function republishTxid( currency: string, txid: string){

  currency = currency.toLowerCase()

  await  channel.publish( `${currency}.anypayinc.com`, 'walletnotify', Buffer.from(txid))

  return txid;

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

