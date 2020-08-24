import * as fs from 'fs'

import * as PaymentProtocol from '../../vendor/bitcore-payment-protocol'
import { getBitcore } from '../bitcore'
import { log } from '../logger'

import { getBaseURL } from './environment';

import { PaymentOutput, PaymentOption, GetCurrency, Currency } from './types'
import { codeFromName } from './currencies'
import { getFee, Fee } from './fees'


/*

  BIP70 Protocol In The Context Of the Anypay Pay Protocol

*/

interface Bip70PaymentRequest {

}

export function getCurrency(params: GetCurrency): Currency {

  let headers = params.headers

  var name;

  if (headers['accept'] && headers['accept'].match(/paymentrequest$/)) {

    let accept = headers['accept'].split('/')[1]

    name = accept.split('-')[0]

  } else if (headers['content-type'] && headers['content-type'].match(/payment$/)) {

    let parts = headers['content-type'].split('/')[1]

    name = parts.split('-')[0]

  } else if (headers['accept'] && headers['accept'].match(/paymentack$/)) {

    let parts = headers['accept'].split('/')[1]

    name = parts.split('-')[0]
  }

  if (!codeFromName(name)) {
    throw new Error(`currency not supported`)
  }

  return {
    name,
    code: codeFromName(name)
  }

}


export async function buildOutputs(payment_option: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(payment_option.currency);

  return payment_option.outputs.map(o => {

    var output = new PaymentProtocol.Output();
    const script = bitcore.Script.buildPublicKeyHashOut(o.address)
    
    output.$set('amount', o.amount);
    output.$set('script', script.toBuffer());

    return output

  })

}

const BASE_URL = getBaseURL();

export async function buildPaymentRequest(paymentOption) {

  // build outputs
  let outputs = await buildOutputs(paymentOption);

  log.info(`bip70.${paymentOption.currency}.outputs`, {outputs});

  var pd = new PaymentProtocol.PaymentDetails();

  pd.set('time', 0);
  pd.set('outputs', outputs);

  var now = Date.now() / 1000 | 0;

  pd.set('time', now);
  pd.set('expires', now + 60 * 60 * 24);

  pd.set('memo', `Anypay® Payment Request ${paymentOption.invoice_uid}`);

  pd.set('payment_url', `${BASE_URL}/r/${paymentOption.invoice_uid}/pay/${paymentOption.currency}/bip70`);

  if (paymentOption.currency === 'BCH') {
    pd.set('required_fee_rate', 1);
  }
  pd.set('merchant_data', paymentOption.invoice_uid); // identify the request

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

