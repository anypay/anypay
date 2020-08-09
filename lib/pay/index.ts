
import { VerifyPayment, PaymentOutput, PaymentOption } from './types';

import { getBitcore } from '../bitcore';

import * as bip70 from './bip_70';
import * as bip270 from './bip_270';
import * as jsonV2 from './json_v2';

export async function verifyPayment(v: VerifyPayment) {

  let bitcore = getBitcore(v.payment_option.currency)

  let tx = new bitcore.Transaction(v.hex);

  let outputs: PaymentOutput[] = await buildOutputs(v.payment_option);

  for (let output of outputs) {

    verifyOutput(tx.outputs, output.script, output.amount);
  }

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<any[]> {

  switch(paymentOption.protocol) {

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

export function verifyOutput(outputs, script, amount) {

  var targetScript = script.buffer.toString('hex')

  var targetAmount = amount.toNumber();

  let matchingOutput = outputs.filter(output => {

    let { amount, script } = output.toJSON();

    return script === targetScript && amount === targetAmount;

  });

  if (matchingOutput.length === 0) {
    throw new Error(`Missing required output ${targetScript} ${targetAmount}`) 
  }

}

