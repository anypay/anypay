/*

  JSON Payment Protocol Version 2 In The Context Of the Anypay Pay Protocol

*/

require('dotenv').config();

import * as moment from 'moment';

import { PaymentOutput, PaymentOption } from './types';
import { BigNumber } from 'bignumber.js';

import { getFee, Fee } from './fees';
import { getBaseURL } from './environment';

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

const BASE_URL = getBaseURL();

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions = {}): Promise<JsonV2PaymentRequest> {
  var outputs;

  if (paymentOption.outputs) {
    outputs = paymentOption.outputs
  } else {
    outputs = await buildOutputs(paymentOption)
  }

  const paymentRequest = {
    "network": "main",
    "currency": paymentOption.currency,
    "requiredFeeRate": 1,
    "outputs": outputs,
    "time": moment(paymentOption.createdAt).toDate(),
    "expires": moment(paymentOption.createdAt).add(15, 'minutes').toDate(),
    "memo": `Payment request for Anypay invoice ${paymentOption.invoice_uid}`,
    "paymentUrl": `${BASE_URL}/payments/jsonv2/${paymentOption.currency}/${paymentOption.invoice_uid}`,
    "paymentId": paymentOption.invoice_uid
  }

  return paymentRequest;

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<JsonV2Output[]> {

  let fee: Fee = await getFee(paymentOption.currency);

  if (paymentOption.fee) {
    fee.amount = paymentOption.fee;
  }

  let amount = new BigNumber(paymentOption.amount);
  var address = paymentOption.address;

  if (address.match(/\:/)) {
    address = address.split(':')[1];
  }

  if (paymentOption.outputs) {

    return paymentOption.outputs;

  } else {

    return [{
      "amount": amount.times(100000000).toNumber(),
      "address": address
    }, {
      "amount": fee.amount,
      "address": fee.address
    }]

  }

}

