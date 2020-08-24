
import { PaymentOutput, PaymentOption, GetCurrency, Currency } from './types';

import { getBitcore, toSatoshis } from '../bitcore';
import { getFee, Fee } from './fees';

import * as moment from 'moment';

import { models } from '../models'

export function getCurrency(params: GetCurrency): Currency {

  return {
    name: 'bitcoinsv',
    code: 'BSV'
  }
}

export async function buildOutputs(paymentOption: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(paymentOption.currency);


  let fee: Fee = await getFee(paymentOption.currency);
  let feeAddress = new bitcore.Address(fee.address);
  let feeScript = new bitcore.Script(feeAddress);

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

export async function buildPaymentRequest(paymentOption: PaymentOption): Promise<Bip270PaymentRequest> {

  let invoice = await models.Invoice.findOne({ where: { uid: paymentOption.invoice_uid }});

  let account = await models.Account.findOne({ where: { id: invoice.account_id }});

  var merchantName = account.business_name;
  var avatarUrl = account.image_url;

  let outputs = await buildOutputs(paymentOption)

  let request = {
    network:"bitcoin-sv",
    outputs,
    creationTimestamp: moment(invoice.createdAt).unix(),
    expirationTimestamp: moment(invoice.expiry).unix(),
    memo: "Bitcoin SV Payment Request by Anypay Inc",
    paymentUrl: `${process.env.API_BASE}/r/${invoice.uid}/pay/BSV/bip270`,
    merchantData: JSON.stringify({
      invoiceUid: invoice.uid,
      merchantName,
      avatarUrl
    })
  }

  return request

}

