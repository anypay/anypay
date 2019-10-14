import {plugins} from './plugins';
import * as LitecoinAddressService from './litecoin/address_service';
import * as BitcoinCashAddressService from './bitcoin_cash/address_service';
import * as RippleAddressService from './ripple/address_service';
import * as BitcoinAddressService from './bitcoin/address_service';
import * as DogecoinAddressService from './dogecoin/address_service';
import * as ZcashAddressService from './zcash/address_service';
import * as ZencashAddressService from './zencash/address_service';

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

  console.log('converting price');

  let coin = getCoin(invoiceCurrency);

  let invoiceAmount = await convert({
    currency: account.denomination,
    value: denominationAmountValue
  }, invoiceCurrency, coin.precision);

  console.log('converted price', invoiceAmount);
  console.log('getting new invoice address');

  let address = await getNewInvoiceAddress(accountId, invoiceCurrency);

  console.log('got new invoice address', address);

  let invoiceChangeset: InvoiceChangeset = {
    accountId,
    address: address.value,
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

    amount: invoiceChangeset.invoiceAmount.value, // DEPRECATED
    currency: invoiceChangeset.invoiceAmount.currency, // DEPRECATED
    dollar_amount: invoiceChangeset.denominationAmount.value // DEPRECATED
  }

  var invoice = await models.Invoice.create(invoiceParams);

  emitter.emit('invoice.created', invoice.uid);

  let route = await createAddressRoute(invoice);

  console.log('address_route.created', route.toJSON());

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

  if (!invoice) {
    throw new Error(`invoice ${uid} not found`);
  }

  let newInvoice = await generateInvoice(
    invoice.account_id,
    invoice.denomination_amount,
    currency,
    invoice.uid
  );

  await invoice.destroy();

  return newInvoice;
}

