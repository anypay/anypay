
import * as PaymentProtocol from '../../vendor/bitcore-payment-protocol';

import { PaymentOutput, PaymentOption } from './types';

import { getBitcore } from '../bitcore';
import { getFee, Fee } from './fees';

/*

  BIP70 Protocol In The Context Of the Anypay Pay Protocol

*/

interface Bip70PaymentRequest {

}

export async function buildOutputs(payment_option: PaymentOption): Promise<PaymentOutput[]> {

  let bitcore = getBitcore(payment_option.currency);

  return payment_option.outputs.map(o => {

    var output = new PaymentProtocol.Output();
    const script = bitcore.Script.buildPublicKeyHashOut(o.address)
    
    output.$set('amount', o.amount);
    output.$set('script', script.toBuffer());

    return output

  })

}

export async function buildPaymentRequest(paymentOption: PaymentOption): Promise<Bip70PaymentRequest> {

  return {};

}

