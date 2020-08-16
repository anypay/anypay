require('dotenv').config();

import * as PaymentProtocol from '../vendor/bitcore-payment-protocol';

const bitcoreBCH: any = require('bitcore-lib-cash');
const bitcoreBTC: any = require('bitcore-lib');
const bitcoreDASH: any = require('@dashevo/dashcore-lib');

import * as fs from 'fs';
import { join } from 'path';

/*
 * Environment Variables:
 *
 * - X509_DOMAIN_CERT_DER_PATH
 * - X509_ROOT_CERT_DER_PATH
 * - X509_PRIVATE_KEY_PATH
 *
 */

import { buildOutputs } from './pay/bip_70'

export function createBIP70Request(invoice, account, paymentOption) {

  // build outputs
  let outputs = buildOutputs(paymentOption);

  console.log('outputs', outputs);

  var pd = new PaymentProtocol.PaymentDetails();

  pd.set('time', 0);
  pd.set('outputs', outputs);

  var now = Date.now() / 1000 | 0;

  pd.set('time', now);
  pd.set('expires', now + 60 * 60 * 24);

  if (account.business_name) {

    pd.set('memo', `Pay ${invoice.denomination_amount} ${invoice.denomination_currency} to ${account.business_name} | AnypayInc.com`);

  } else {

    pd.set('memo', `Invoice for ${invoice.denomination_amount} ${invoice.denomination_currencyr} | AnypayInc.com`);

  }

  switch(paymentOption.currency) {
  case 'BCH':
    pd.set('payment_url', `https://api.anypayinc.com/invoices/${invoice.uid}/pay/bip70/bch`);
    break;
  case 'DASH':
    pd.set('payment_url', `https://api.anypayinc.com/invoices/${invoice.uid}/pay/bip70/dash`);
    break;
  case 'BSV':
    pd.set('payment_url', `https://api.anypayinc.com/invoices/${invoice.uid}/pay/bip270/bsv`);
    break;
  case 'BTC':
    pd.set('payment_url', `https://api.anypayinc.com/invoices/${invoice.uid}/pay/bip70/btc`);
    break;
  }

  if (paymentOption.currency === 'BCH') {
    pd.set('required_fee_rate', 1);
  }
  pd.set('merchant_data', invoice.uid); // identify the request

  var paypro = new PaymentProtocol(paymentOption.currency);

  paypro.makePaymentRequest();

  paypro.set('serialized_payment_details', pd.toBuffer());

  let domainDerPath = process.env.X509_DOMAIN_CERT_DER_PATH;
  let rootDerPath = process.env.X509_ROOT_CERT_DER_PATH;
  let keyPath = process.env.X509_PRIVATE_KEY_PATH;

  const file_with_x509_private_key = fs.readFileSync(keyPath);

  const certificates = new PaymentProtocol().makeX509Certificates();

  certificates.set('certificate', [
    fs.readFileSync(domainDerPath),
    fs.readFileSync(rootDerPath)
  ]);

  paypro.set('payment_details_version', 1);

  paypro.set('pki_type', 'x509+sha256');

  paypro.set('pki_data', certificates.serialize());

  paypro.sign(file_with_x509_private_key);

  return paypro;

}

export { PaymentProtocol }
