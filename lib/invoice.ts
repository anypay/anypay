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

const log = require("winston");

import * as bch from '../plugins/bch';

import * as xrp from '../plugins/xrp';

import { models } from './models';

import {convert} from './prices';

import {getCoin} from './coins';

import * as shortid from 'shortid'

import { computeInvoiceURI } from './uri';

import { writePaymentOptions } from './payment_options';

import {channel} from './amqp';

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

export async function generateInvoice(

  accountId: number,
  denominationAmountValue: number,
  invoiceCurrency: string,
  uid?: string

): Promise<any> {

  uid = !!uid ? uid : shortid.generate();

  var account = await models.Account.findOne({ where: { id: accountId }});
  log.info({ account })

  let addresses = await models.Address.findAll({ where: {
    account_id: account.id
  }});

  addresses = _.reject(addresses, (address) => {
    let coin = getCoin(address.currency);
    if (!coin) { return true }
    return coin.unavailable;
  });

  let coin = getCoin(invoiceCurrency);

  let invoiceAmounts = await Promise.all(addresses.map(async (address) => {

    let conversion = await convert({
      currency: account.denomination,
      value: denominationAmountValue
    }, address.currency, coin.precision);

    if (address.price_scalar) {
      conversion = applyScalar(conversion, address.price_scalar);
    }

    return conversion;

  }));

  let invoiceAmount: any = invoiceAmounts.find((elem:any)=> elem.currency === invoiceCurrency);

  let newAddresses = await Promise.all(addresses.map(async (address:any) => {
    let newAddress = await getNewInvoiceAddress(accountId, address.currency);
    return {
      currency: address.currency,
      address: newAddress.value
    }
  }));

  let address:any = newAddresses.find((elem:any)=> elem.currency === invoiceCurrency);

  let invoiceChangeset: InvoiceChangeset = {
    accountId,
    address: address.address,
    denominationAmount: {
      currency: account.denomination,
      value: denominationAmountValue
    },
    invoiceAmount
  };

  var invoiceParams = {
    address: invoiceChangeset.address,
    invoice_amount: invoiceChangeset.invoiceAmount.value,
    invoice_currency: invoiceChangeset.invoiceAmount.currency,
    denomination_currency: invoiceChangeset.denominationAmount.currency,
    denomination_amount: invoiceChangeset.denominationAmount.value,
    account_id: invoiceChangeset.accountId,
    status: 'unpaid',
    uid,
    uri: computeInvoiceURI({
      currency: 'ANYPAY',
      uid
    }),
    should_settle: account.should_settle,
    amount: invoiceChangeset.invoiceAmount.value, // DEPRECATED
    currency: invoiceChangeset.invoiceAmount.currency, // DEPRECATED
  }

  var invoice = await models.Invoice.create(invoiceParams);

  let matrix = _.zip(addresses, invoiceAmounts, newAddresses)

  let uris = matrix.map((row) => {
    let address = row[0];

    return  computeInvoiceURI({
      currency: address.currency,
      uid
    });
  });

  matrix = matrix.map((row, i) => {

    row.push(uris[i]);

    return row;
  });

  /*

    Ambassador Output:

    If an ambassador is available for the account, include them as a separate output according to the ambassadorship
    amount (default 0.01 USD)

  */

  log.info('ambassador_id', account.ambassador_id)

  let ambassador = await getAmbassadorAccount(account.ambassador_id)

  log.info({ event: 'ambassador.found', ambassador})

  let paymentOptions: any[] = await Promise.all(matrix.map(async (row) => {

    let currency = row[0].currency

    let fee = await pay.fees.getFee(currency)

    var address = row[2].address;

    if (address.match(':')) {
      address = address.split(':')[1]
    }

    var address = row[2].address;
    
    if (address.match(':')) {
      address = address.split(':')[1]
    }

    var amount = pay.toSatoshis(row[1].value);

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

          ambassadorAmount = parseInt(new BigNumber(amount).times(scalar).toNumber().toFixed(0))

        } else {

          let conversion = await convert({ value: 0.01, currency: 'USD' }, currency)

          ambassadorAmount = pay.toSatoshis(conversion.value)

        }

        amount = new BigNumber(amount).minus(ambassadorAmount).toNumber()

        outputs.push({
          address: record.value,
          amount: ambassadorAmount
        })
        
      }

    }

    outputs.push({
      address,
      amount
    })

    outputs.push(fee)

    return {
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

