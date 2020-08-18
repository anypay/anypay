
import { VerifyPayment, PaymentOutput, PaymentOption } from './types';

import { log } from '../logger'

import { getBitcore } from '../bitcore';

import { BigNumber } from 'bignumber.js';

import { broadcast } from './broadcast'

import * as bip70 from './bip_70';
import * as bip270 from './bip_270';
import * as jsonV2 from './json_v2';

import * as fees from './fees';

export { fees }

export async function verifyPayment(v: VerifyPayment) {

  let bitcore = getBitcore(v.payment_option.currency)

  let tx = new bitcore.Transaction(v.hex);

  let txOutputs = tx.outputs.map(output => {

    try {

      let address = new bitcore.Address(output.script).toString()

      if (address.match(':')) {
        address = address.split(':')[1]
      }

      return {
        address,
        amount: output.satoshis
      }

    } catch(error) {

      return null

    }

  })
  .filter(n => n != null)

  console.log("txOutputs", txOutputs);

  let outputs: PaymentOutput[] = await buildOutputs(v.payment_option, v.protocol);

  for (let output of outputs) {

    if (output.address.match(':')) {
      output.address = output.address.split(':')[1]
    }

    verifyOutput(txOutputs, output.address, output.amount);
  }

}

export async function buildPaymentRequest(paymentOption): Promise<any> {

  switch(paymentOption.protocol) {

  case 'BIP70':

    return bip70.buildPaymentRequest(paymentOption);

  case 'BIP270':

    return bip270.buildPaymentRequest(paymentOption);

  case 'JSONV2':

    return jsonV2.buildPaymentRequest(paymentOption);

  default:

    throw new Error(`protocol ${paymentOption.protocol} not supported`)

  }

}

export async function buildOutputs(paymentOption: PaymentOption, protocol: string): Promise<any[]> {

  switch(protocol) {

  case 'BIP70':

    return bip70.buildOutputs(paymentOption);

  case 'BIP270':

    return bip270.buildOutputs(paymentOption);

  case 'JSONV2':

    return jsonV2.buildOutputs(paymentOption);

  default:

    throw new Error(`protocol ${paymentOption.protocol} not supported`)

  }

}

export function verifyOutput(outputs, targetAddress, targetAmount) {

  let matchingOutput = outputs.filter(output => {

    return output.address === targetAddress && output.amount === targetAmount;

  });

  if (matchingOutput.length === 0) {
    throw new Error(`Missing required output ${targetAddress} ${targetAmount}`) 
  }

  log.info('output.verified', {
    address: targetAddress,
    amount: targetAmount
  })

}

const SATOSHIS = 100000000

export function toSatoshis(decimal: number): number {

  return (new BigNumber(decimal)).times(SATOSHIS).toNumber()

}

export { broadcast }

export function fromSatoshis(integer: number): number {

  return (new BigNumber(integer)).dividedBy(SATOSHIS).toNumber()

}

