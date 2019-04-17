
import { log } from '../../../lib';

import { channel } from '../../../lib/amqp';

import { handlePaymentMessage } from '../../processor/payments/main';

export async function create(req, h) {

  log.info('bch.addressforwardcallback', req.payload);

  let payment = {
    currency: "BCH",
    amount: req.payload.value,
    address: req.payload.input_address,
    hash: req.payload.input_transaction_hash,
    output_hash: req.payload.destination_transaction_hash
  }

  /* Handle payment by matching to an invoice */
  await handlePaymentMessage(payment);

  log.info('bch.payment', payment);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return payment;

}

