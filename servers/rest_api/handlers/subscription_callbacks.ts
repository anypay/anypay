import { log } from '../../../lib';

import { handlePaymentMessage } from '../../processor/payments/main';

import { channel } from '../../../lib/amqp';

export async function subscribtionCallback(req, h){

  log.info('subscription.callback', req.payload);

  let payment = {
    currency: req.payload.currency,
    amount: parseFloat(req.payload.value),
    address: req.payload.address,
    hash: req.payload.hash,
    output_hash: req.payload.hash
  };

  log.info(`${req.payload.currency}.payment`, payment);

  /* Handle payment by matching to an invoice */
  await handlePaymentMessage(payment);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return payment;



}
