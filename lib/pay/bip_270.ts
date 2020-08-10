
import { PaymentOutput, PaymentOption } from './types';

import { getBitcore, toSatoshis } from '../bitcore';
import { getFee, Fee } from './fees';

/*

  BIP270 Protocol In The Context Of the Anypay Pay Protocol

*/

interface Bip270PaymentRequest {

}

export async function buildOutputs(paymentOption: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(paymentOption.currency);

  let address = new bitcore.Address(paymentOption.address);
  let script = new bitcore.Script(address);

  let fee: Fee = await getFee(paymentOption.currency);
  let feeAddress = new bitcore.Address(fee.address);
  let feeScript = new bitcore.Script(feeAddress);

  let outputs = [{
    script: script.toHex(),
    amount: toSatoshis(paymentOption.amount)
  }, {
    script: feeScript.toHex(),
    amount: fee.amount
  }]

  return outputs;

}

export async function buildPaymentRequest(paymentOption: PaymentOption): Promise<Bip270PaymentRequest> {

  return {};

}

