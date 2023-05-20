/*

  JSON Payment Protocol Version 2 In The Context Of the Anypay Pay Protocol

*/

require('dotenv').config();

import * as moment from 'moment';

import { PaymentOption, GetCurrency, Currency } from '../types';

import { nameFromCode } from '../currencies';

import { BigNumber } from 'bignumber.js';

import { getFee, Fee } from '../fees';

import { getBaseURL } from '../environment';

import { getRequiredFeeRate } from '../required_fee_rate'

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

import { PaymentRequestOptions } from '../'

export async function buildPaymentRequest(paymentOption: PaymentOption, options: PaymentRequestOptions={}): Promise<JsonV2PaymentRequest> {
  var outputs;

  const { currency, invoice_uid } = paymentOption

  if (paymentOption.outputs) {

    outputs = paymentOption.outputs

  } else {

    outputs = await buildOutputs(paymentOption)

  }

  const requiredFeeRate = await getRequiredFeeRate({ chain: currency })

  const network = "main"

  const time = moment(paymentOption.createdAt).toDate()

  const expires = moment(paymentOption.createdAt).add(15, 'minutes').toDate()

  const { memo } = options

  const paymentUrl = `${BASE_URL}/r/${invoice_uid}/pay/${currency}/jsonv2`

  const paymentId = invoice_uid

  const paymentRequest = {
    network,
    currency,
    requiredFeeRate,
    outputs,
    time, 
    expires,
    memo,
    paymentUrl,
    paymentId
  }

  return paymentRequest;

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<JsonV2Output[]> {

  if (paymentOption.outputs) {

    return paymentOption.outputs;

  } else {

    let fee: Fee = await getFee(paymentOption.currency);

    if (paymentOption.fee) {
      fee.amount = paymentOption.fee;
    }

    let amount = new BigNumber(paymentOption.amount);
    var address = paymentOption.address;

    if (address.match(/\:/)) {
      address = address.split(':')[1];
    }

    return [{
      "amount": amount.times(100000000).toNumber(),
      "address": address
    }, {
      "amount": fee.amount,
      "address": fee.address
    }]

  }

}

import * as schema from './schema'

import * as protocol from './protocol'

export { schema, protocol }


