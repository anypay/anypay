
import { PaymentOutput, PaymentOption } from './types';

import { getBitcore } from '../bitcore';
import { getFee, Fee } from './fees';

import { BigNumber } from 'bignumber.js';

/*

  BIP270 Protocol In The Context Of the Anypay Pay Protocol

*/

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

function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 
  let scalar = new BigNumber(100000000);

  return amt.times(amount).toNumber();
}

