
import { awaitChannel } from '../../../lib/amqp';
import { log } from '../../../lib';

import * as Boom from 'boom';

export async function create(req, h) {

  console.log('register payment', req.payload); 

  if (req.auth.credentials.coin !== req.payload.input_currency) {

    return Boom.badRequest(`oracle not authorized for coin ${req.payload.currency}`);

  }
  let payment = {
    currency: req.payload.input_currency,
    amount: parseFloat(req.payload.value),
    address: req.payload.input_address,
    hash: req.payload.input_transaction_hash,
    locked: req.payload.locked || false,
    output_hash: req.payload.destination_transaction_hash,
    output_currency: req.payload.output_currency,
    output_amount: req.payload.output_amount,
    output_address: req.payload.output_address
  };

  let channel = await awaitChannel();

  req.payload.amount = parseFloat(req.payload.amount);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return { success: true };

}

