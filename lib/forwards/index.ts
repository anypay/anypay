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
interface PaymentForwardInputPayment {

  amount: number;

  txid: string;

}

interface PaymentForwardOutputPayment {

  amount: number;

  txid: string;

}

export async function createPaymentForward(paymentForward: PaymentForward) {

  let record = await models.PaymentForward.create({

  
    input_address: paymentForward.input.address,

    input_currency: paymentForward.input.currency,

    output_address: paymentForward.output.address,

    output_currency: paymentForward.output.currency

  });

  log.info('paymentforward:created', record.toJSON());

  emitter.emit('paymentforward:created', record.toJSON());

  return record;

}

export async function getPaymentForwardByInput(inputAddress: InputAddress) {

  let record = await models.PaymentForward.findOne({ where: {

    input_address: inputAddress.address,

    input_currency: inputAddress.currency
  
  }});

  if (!record) {

    return;

  }

  log.info('paymentforward:retrieved', record.toJSON());

  emitter.emit('paymentforward:retrieved', record.toJSON());

  return record;

}

export async function createPaymentForwardInputPayment(paymentForwardId: number, paymentForwardInputPayment: PaymentForwardInputPayment) {

  let record = await models.PaymentForwardInputPayment.create({

    payment_forward_id: paymentForwardId,

    txid: paymentForwardInputPayment.txid,

    amount: paymentForwardInputPayment.amount

  });

  log.info('paymentforwardinputpayment:created', record.toJSON());

  emitter.emit('paymentforwardinputpayment:created', record.toJSON());

  return record;

}

export async function createPaymentForwardOutputPayment(paymentForwardId: number, paymentForwardInputPaymentId: number, paymentForwardOutputPayment: PaymentForwardOutputPayment) {

  let record = await models.PaymentForwardOutputPayment.create({

    payment_forward_id: paymentForwardId,

    payment_forward_input_payment_id: paymentForwardInputPaymentId,

    txid: paymentForwardOutputPayment.txid,

    amount: paymentForwardOutputPayment.amount

  });

  log.info('paymentforwardoutputpayment:created', record.toJSON());

  emitter.emit('paymentforwardoutputpayment:created', record.toJSON());

  return record;

}
