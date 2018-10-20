import * as models from '../models';

import { log } from '../logger';

import { emitter } from '../events';

interface InputAddress {

  address: string;

  currency: string;

}

interface OutputAddress {

  address: string;

  currency: string;

}

interface PaymentForward {

  input: InputAddress;

  output: OutputAddress;

}

export async function createPaymentForward(paymentForward: PaymentForward) {

  let record = await models.PaymentForward.findOrCreate({

    where: {
    
      input_address: paymentForward.input.address,

      input_currency: paymentForward.input.currency,

      output_address: paymentForward.output.address,

      output_currency: paymentForward.output.currency

    }

  });

  log.info('paymentforward:created', record);

  emitter.emit('paymentforward:created', record);

  return record;

}

export async function getPaymentForwardByInput(inputAddress: InputAddress) {

  let record = await models.PaymentForward.findOne({ where: {

    input_address: inputAddress.address,

    input_currency: inputAddress.currency
  
  }});

  log.info('paymentforward:retrieved', record);

  emitter.emit('paymentforward:retrieved', record);

  return record;

}

