/*

  JSON Payment Protocol Version 2 In The Context Of the Anypay Pay Protocol

*/

import * as moment from 'moment';

import { PaymentOutput, PaymentOption } from './types';
import { BigNumber } from 'bignumber.js';

import { getFee, Fee } from './fees';

interface JsonV2Output {
  address: string;
  amount: number; // integer
}

export interface JsonV2PaymentRequest {
  network: string;
  currency: string;
  requiredFeeRate: number;
  outputs: JsonV2Output[];
  time: Date;
  expires: Date;
  memo: string;
  paymentUrl: string;
  paymentId: string;
}

interface PaymentRequestOptions {

}

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions = {}): Promise<JsonV2PaymentRequest> {

  let outputs = await buildOutputs(paymentOption)

  const paymentRequest = {
    "network": "main",
    "currency": paymentOption.currency,
    "requiredFeeRate": 1,
    "outputs": outputs,
    "time": moment(paymentOption.createdAt).toDate(),
    "expires": moment(paymentOption.createdAt).add(15, 'minutes').toDate(),
    "memo": `Payment request for Anypay invoice ${paymentOption.invoice_uid}`,
    "paymentUrl": `https://api.anypayinc.com/payments/edge/${paymentOption.currency}/${paymentOption.invoice_uid}`,
    "paymentId": paymentOption.invoice_uid
  }

  return paymentRequest;

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<JsonV2Output[]> {

  let fee: Fee = await getFee(paymentOption.currency);

  let amount = new BigNumber(paymentOption.amount);
  var address = paymentOption.address;

  if (address.match(/\:/)) {
    address = address.split(':')[1];
  }

  let outputs = [{
    "amount": amount.times(100000000).toNumber(),
    "address": address
  }, {
    "amount": fee.amount,
    "address": fee.address
  }]

  return outputs;

}

