import { log } from '../../../lib';

import { handlePaymentMessage } from '../../processor/payments/main';

import { channel } from '../../../lib/amqp';

export async function subscriptionCallback(req, h){

  log.info('subscription.callback', req.payload);

  console.log('input_currency', typeof req.payload.input_currency, req.payload.input_currency)
  console.log('input_address', typeof req.payload.input_address, req.payload.input_address)
  console.log('hash', typeof req.payload.input_transaction_hash, req.payload.input_transaction_hash)
  console.log('destination tx hash', typeof req.payload.destination_transaction_hash, req.payload.destination_transaction_hash)


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

  log.info(`payment`, payment);

  /* Handle payment by matching to an invoice */
  await handlePaymentMessage(payment);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return payment;



}

