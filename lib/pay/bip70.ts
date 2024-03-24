import * as fs from 'fs'

//@ts-ignore
import * as PaymentProtocol from 'bip70-payment-protocol'

import { getBitcore } from '../bitcore'

import { log } from '../log'

import { getBaseURL } from './environment';

import { PaymentOutput, PaymentOption, GetCurrency, Currency } from './types'

import { codeFromName } from './currencies'

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

  } else if (headers['x-accept'] && headers['x-accept'].match(/paymentack$/)) {

    let parts = headers['x-accept'].split('/')[1]

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

  if (!payment_option.outputs) {
    return []
  }

  return payment_option.outputs.map(o => {

    var output = new PaymentProtocol.Output();
    var script

    if (o.address?.match(/^1/)) {

      script = bitcore.Script.buildPublicKeyHashOut(o.address)

    } else if (o.address?.match(/^3/)){
      try {

        script = bitcore.Script.buildScriptHashOut(new bitcore.Address(o.address))

      } catch(error: any) {

        log.error('bitcore.error', error)
      }

    } else {

      script = bitcore.Script.buildPublicKeyHashOut(o.address)

    }

    output.$set('amount', o.amount);
    output.$set('script', script.toBuffer());

    return output

  })

}

const BASE_URL = getBaseURL();

import { PaymentRequest, PaymentRequestOptions } from './'
import { config } from '../config';

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions={}): Promise<PaymentRequest> {

  // build outputs
  let outputs = await buildOutputs(paymentOption);

  log.info(`bip70.${paymentOption.currency}.outputs`, {outputs});

  var pd = new PaymentProtocol.PaymentDetails();

  pd.set('time', 0);
  pd.set('outputs', outputs);

  var now = Date.now() / 1000 | 0;

  pd.set('time', options.time || now);
  pd.set('expires', options.expires || now + 60 * 60 * 24);

  if (options.memo) {

    pd.set('memo', options.memo)

  }

  pd.set('payment_url', `${BASE_URL}/r/${paymentOption.invoice_uid}/pay/${paymentOption.currency}/bip70`);

  if (config.get(`REQUIRED_FEE_RATE_${paymentOption.currency}`)) {
    pd.set('required_fee_rate', parseInt(String(config.get(`REQUIRED_FEE_RATE_${String(paymentOption.currency)}`))));
  } else {
    pd.set('required_fee_rate', 1);
  }

  pd.set('merchant_data', paymentOption.invoice_uid); // identify the request

  var paypro = new PaymentProtocol(paymentOption.currency);

  paypro.makePaymentRequest();

  paypro.set('serialized_payment_details', pd.toBuffer());

  if (config.get('NODE_ENV') !== 'development' && config.get('NODE_ENV') !== 'test') {
    try {

      let domainDerPath = String(config.get('X509_DOMAIN_CERT_DER_PATH'));
      let rootDerPath = String(config.get('X509_ROOT_CERT_DER_PATH'));
      let keyPath = String(config.get('X509_PRIVATE_KEY_PATH'));

      const file_with_x509_private_key = fs.readFileSync(keyPath);

      console.log({ file_with_x509_private_key })

      const certificates = new PaymentProtocol().makeX509Certificates();

      console.log({ domainDerPath, rootDerPath, keyPath })

      const domainDer = fs.readFileSync(domainDerPath)

      console.log({ domainDer })

      const rootDer = fs.readFileSync(rootDerPath)

      console.log({ rootDer })

      certificates.set('certificate', [
        domainDer,
        rootDer
      ]);

      const pki_data = certificates.serialize()

      console.log({ pki_data })

      paypro.set('payment_details_version', 1);

      paypro.set('pki_type', 'x509+sha256');

      paypro.set('pki_data', pki_data);

      console.log("about to sign")

      paypro.sign(file_with_x509_private_key);

    } catch(error: any) {

      log.error('paypro.bip70.error', error)

    }

  }

  return paypro;

}

export function paymentRequestToJSON(hex: any, currency: string) {

  let bitcore = getBitcore(currency)

  let paymentRequest = PaymentProtocol.PaymentRequest.decodeHex(hex);

  let details = PaymentProtocol.PaymentDetails.decode(paymentRequest.get('serialized_payment_details'))

  let decoded = {
    PaymentRequest: paymentRequest,
    PaymentDetails: details,
    outputs: details.outputs.map((output: { script: { toString: (arg0: string) => any; }; amount: string; }) => {
      return {
        address: new bitcore.Address(new bitcore.Script(output.script.toString('hex'))).toString(),
        amount: parseInt(output.amount)
      }
    }),
    merchant_data: details.merchant_data.buffer.toString()
  }

  return decoded

}

