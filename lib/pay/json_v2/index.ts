/*

  JSON Payment Protocol Version 2 In The Context Of the Anypay Pay Protocol

*/

require('dotenv').config();

import * as moment from 'moment';

import { PaymentOutput, PaymentOption, GetCurrency, Currency } from '../types';
import { nameFromCode } from '../currencies';
import { BigNumber } from 'bignumber.js';

import { getFee, Fee } from '../fees';
import { getBaseURL } from '../environment';

import { toSatoshis } from '../'

interface JsonV2Output {
  address?: string;
  amount: number; // integer
}

export function getCurrency(params: GetCurrency): Currency {

  let code = params.headers['x-currency']

  if (!code) {
    throw new Error('x-currency header must be provided with value such as BCH,DASH,BSV,BTC,LTC')
    //code = 'BCH'
  }

  return {
    code,
    name: nameFromCode(code)
  }

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

const BASE_URL = getBaseURL();

export async function buildPaymentRequest(paymentOption: PaymentOption): Promise<JsonV2PaymentRequest> {
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
    "memo": `Anypay Payment Request ${paymentOption.invoice_uid}`,
    "paymentUrl": `${BASE_URL}/r/${paymentOption.invoice_uid}/pay/${paymentOption.currency}/jsonv2`,
    "paymentId": paymentOption.invoice_uid
  }

  if (process.env[`REQUIRED_FEE_RATE_${paymentOption.currency}`]) {
    paymentRequest.requiredFeeRate = parseInt(process.env[`REQUIRED_FEE_RATE_${paymentOption.currency}`])
  }

  return paymentRequest;

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<JsonV2Output[]> {

  if (paymentOption.outputs) {

    return paymentOption.outputs;

  } else {

    var { address, currency } = paymentOption;

    const amount = toSatoshis(paymentOption.amount)

    if (address.match(/\:/)) {
      address = address.split(':')[1];
    }

    const outputs = [{
      "amount": amount,
      "address": address
    }]

    let fee: Fee = await getFee(currency, amount);

    outputs.push({
      "amount": fee.amount,
      "address": fee.address
    })

    return outputs

  }

}

import * as schema from './schema'
import * as protocol from './protocol'

export { schema, protocol }


