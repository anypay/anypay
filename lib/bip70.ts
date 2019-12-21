require('dotenv').config();

import * as PaymentProtocol from '../vendor/bitcore-payment-protocol';

const bitcore: any = require('bitcore-lib-cash');

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

export function generatePaymentRequest(invoice, account) {

  // build outputs
  let outputs = ((outputs) => {

    var output = new PaymentProtocol.Output();
    const script = bitcore.Script.buildPublicKeyHashOut(invoice.address)

    output.$set('amount', invoice.amount * 100000000); // BCH -> satoshis
    output.$set('script', script.toBuffer());

    outputs.push(output);

    /* Output2 is Anypay: $0.01 per transaction on top*/
    var output2 = new PaymentProtocol.Output();
    const script2 =bitcore.Script.buildPublicKeyHashOut('bitcoincash:qrggz7d0sgv4v3d0jl7lj4mv2vdnv0vqjsq48qtvt6')

    output2.$set('amount', 5000);
    output2.$set('script', script2.toBuffer());

    outputs.push(output2);

    return outputs;

  })([]);

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

  pd.set('payment_url', `https://anypayinc.com/payments/${invoice.uid}`);
  pd.set('required_fee_rate', 1);
  pd.set('merchant_data', invoice.uid); // identify the request

  var paypro = new PaymentProtocol('BCH');

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


