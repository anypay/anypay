
import * as PaymentProtocol from '../../vendor/bitcore-payment-protocol';

import { PaymentOutput, PaymentOption } from './types';

import { getBitcore } from '../bitcore';
import { getFee, Fee } from './fees';

/*

  BIP70 Protocol In The Context Of the Anypay Pay Protocol

*/

export async function buildOutputs(payment_option: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(payment_option.currency);

  var outputs = [];

  var output = new PaymentProtocol.Output();
  const script = bitcore.Script.buildPublicKeyHashOut(payment_option.address)

  output.$set('amount', payment_option.amount * 100000000); // BCH -> satoshis
  output.$set('script', script.toBuffer());

  outputs.push(output)

  let fee: Fee = await getFee(payment_option.currency)

  var output2 = new PaymentProtocol.Output();
  const script2 = bitcore.Script.buildPublicKeyHashOut(fee.address)

  output2.$set('amount', fee.amount);
  output2.$set('script', script2.toBuffer());

  outputs.push(output2);

  return outputs;

}

