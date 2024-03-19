
import { PaymentOutput, PaymentOption, GetCurrency, Currency } from './types';

import { getBitcore } from '../bitcore';

import * as moment from 'moment';

import { models } from '../models'

import { config } from '../config'

export function getCurrency(params: GetCurrency): Currency {

  return {
    name: 'bitcoinsv',
    code: 'BSV'
  }
}

export async function buildOutputs(paymentOption: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(paymentOption.currency);
  
  if (!paymentOption.outputs || paymentOption.outputs?.length === 0) {  
    return []
  }

  let outputs = paymentOption.outputs.map(output => {

    let address = new bitcore.Address(output.address);
    let script = new bitcore.Script(address);

    return {
      script: script.toHex(),
      amount: output.amount
    }

  });

  return outputs;

}

interface Bip270PaymentRequest {
  network: string;
  outputs: any[],
  creationTimestamp: number;
  expirationTimestamp: number;
  memo: string
  paymentUrl: string;
  merchantData: string;
}

export async function getMerchantData(invoiceUid: string, account_id?: number): Promise<string> {

  if (!account_id) {
    return JSON.stringify({ invoiceUid })
  }

  let invoice = await models.Invoice.findOne({ where: { uid: invoiceUid }})

  let account = await models.Account.findOne({ where: { id: account_id }});


  if (invoice.metadata) {

    return JSON.stringify(Object.assign({ invoiceUid }, invoice.metadata))

  } else {

    var merchantName = account.business_name;
    var avatarUrl = account.image_url;

    return JSON.stringify({
      invoiceUid,
      merchantName,
      avatarUrl
    })

  }
}

import { PaymentRequestOptions } from './'

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions={}): Promise<Bip270PaymentRequest> {

  let invoice = await models.Invoice.findOne({ where: { uid: paymentOption.invoice_uid }})

  let merchantData = await getMerchantData(invoice.uid, invoice.account_id)

  let outputs = await buildOutputs(paymentOption)

  let memo = invoice.memo || "Anypay™"

  let request: {
    network: string,
    outputs: any[],
    creationTimestamp: number,
    expirationTimestamp: number,
    memo: string,
    paymentUrl: string,
    merchantData: string
    redirectUrl?: string
  } = {
    network:"bitcoin-sv",
    outputs,
    creationTimestamp: moment(invoice.createdAt).unix(),
    expirationTimestamp: moment(invoice.expiry).unix(),
    memo,
    paymentUrl: `${config.get('API_BASE')}/r/${invoice.uid}/pay/BSV/bip270`,
    merchantData
  }

  if (invoice.redirect_url) {
    request['redirectUrl'] = invoice.redirect_url
  }

  return request

}

