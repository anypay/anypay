
import { log } from '../../../lib';

//import { receivePayment } from '../../../lib/payment_processor';
import { handlePaymentMessage } from '../../processor/payments/main';

import { channel } from '../../../lib/amqp';

export async function create(req, h) {

  log.info('dash.addressforwardcallback', req.payload);

  let payment = {
    currency: "DASH",
    amount: parseFloat(req.payload.value),
    address: req.payload.input_address,
    hash: req.payload.input_transaction_hash,
    output_hash: req.payload.destination_transaction_hash
  };

  log.info('dash.payment', payment);

  /* Handle payment by matching to an invoice */
  await handlePaymentMessage(payment);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return payment;

}

export async function subscribtionCallback(req, h){


  log.info('dash.addressforwardcallback', req.payload);

  let payment = {
    currency: "DASH",
    amount: parseFloat(req.payload.value),
    address: req.payload.address,
    hash: req.payload.hash,
    output_hash: req.payload.hash
  };

  log.info('dash.payment', payment);

  /* Handle payment by matching to an invoice */
  await handlePaymentMessage(payment);

  let buffer = new Buffer(JSON.stringify(payment));

  await channel.publish('anypay.payments', 'payment', buffer);

  return payment;



}

