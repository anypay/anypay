import {plugins} from './plugins';
import * as LitecoinAddressService from './litecoin/address_service';
import * as BitcoinCashAddressService from './bitcoin_cash/address_service';
import * as RippleAddressService from './ripple/address_service';
import * as BitcoinAddressService from './bitcoin/address_service';
import * as DogecoinAddressService from './dogecoin/address_service';
import * as ZcashAddressService from './zcash/address_service';
import * as ZencashAddressService from './zencash/address_service';

import * as _ from 'underscore';

import { createAddressRoute } from './routes';

import * as database from './database';

import { Payment } from '../types/interfaces';

import * as http from 'superagent';

import {emitter} from './events'

const log = require("winston");

import * as bch from '../plugins/bch';

import * as xrp from '../plugins/xrp';

import { models } from './models';

import {convert} from './prices';

import {getCoin} from './coins';

import { computeInvoiceURI } from './uri';

import { writePaymentOptions } from './payment_options';

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

  switch(currency) {

    case 'XRP':

      address = await RippleAddressService.getNewAddress(accountId);

      break;

    default:

      address = await plugins.getNewAddress(currency, accountId);
  }

  if (!address) {
    throw new Error(`unable to generate address for ${currency}`);
  }

  return {
    currency,
    value: address
  }

};

export async function generateInvoice(

  accountId: number,
  denominationAmountValue: number,
  invoiceCurrency: string,
  uid?: string

): Promise<any> {

  var account = await models.Account.findOne({ where: { id: accountId }});

  var bankAccountId;

  if(account.ach_enabled){
    bankAccountId = account.bank_account_id;
  }

  let addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  addresses = _.reject(addresses, (address) => {
    return getCoin(address.currency).unavailable;
  });

  let coin = getCoin(invoiceCurrency);

  let invoiceAmount = await convert({
    currency: account.denomination,
    value: denominationAmountValue
  }, invoiceCurrency, coin.precision);

  let invoiceAmounts = await Promise.all(addresses.map((address) => {

    return convert({
      currency: account.denomination,
      value: denominationAmountValue
    }, address.currency, coin.precision);

  }));

  let newAddresses = await Promise.all(addresses.map(async (address:any) => {
    let newAddress = await getNewInvoiceAddress(accountId, address.currency);
    return {
      currency: address.currency,
      address: newAddress.value
    }
  }));

  let address:any = newAddresses.find((elem:any)=> elem.currency === invoiceCurrency);

  console.log('newAddresses', newAddresses);

  let invoiceChangeset: InvoiceChangeset = {
    accountId,
    address: address.address,
    denominationAmount: {
      currency: account.denomination,
      value: denominationAmountValue
    },
    invoiceAmount
  };

  let uri = computeInvoiceURI({
    currency: invoiceChangeset.invoiceAmount.currency,
    amount: invoiceChangeset.invoiceAmount.value,
    address: invoiceChangeset.address
  });

  let matrix = _.zip(addresses, invoiceAmounts, newAddresses)

  console.log('matrix', matrix);

  let uris = matrix.map((row) => {
    let address = row[0];

    return  computeInvoiceURI({
      currency: address.currency,
      amount: row[1].value,
      address: row[2].address
    });
  });

  matrix = matrix.map((row, i) => {

    row.push(uris[i]);

    return row;
  });

  console.log('matrix2', matrix)

  var invoiceParams = {
    address: invoiceChangeset.address,
    invoice_amount: invoiceChangeset.invoiceAmount.value,
    invoice_currency: invoiceChangeset.invoiceAmount.currency,
    denomination_currency: invoiceChangeset.denominationAmount.currency,
    denomination_amount: invoiceChangeset.denominationAmount.value,
    account_id: invoiceChangeset.accountId,
    status: 'unpaid',
    uid: uid,
    uri,
    bank_account_id: bankAccountId,
    amount: invoiceChangeset.invoiceAmount.value, // DEPRECATED
    currency: invoiceChangeset.invoiceAmount.currency, // DEPRECATED
    dollar_amount: invoiceChangeset.denominationAmount.value // DEPRECATED
  }

  var invoice = await models.Invoice.create(invoiceParams);

  let paymentOptions = matrix.map(row => {

    return {
      invoice_uid: invoice.uid,
      currency: row[0].currency,
      amount: row[1].value,
      address: row[2].address,
      uri: row[3]
    }
  });

  let paymentOptionRecords = await writePaymentOptions(paymentOptions);

  emitter.emit('invoice.created', invoice.uid);

  await Promise.all(paymentOptions.map(option => {

    return createAddressRoute({
      account_id: account.id,
      address: option.address,
      currency: option.currency
    });
  }))

  return invoice;

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

  invoice.currency = option.currency;

  invoice.amount = option.amount;

  invoice.address = option.address;

  invoice.uri = option.uri;
  
  await invoice.save();

  return invoice;

}
