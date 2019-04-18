
import { awaitChannel } from '../../../lib/amqp';
import { log } from '../../../lib';

import * as Boom from 'boom';

export async function create(req, h) {

  console.log('register payment', req.payload); 

  if (req.auth.credentials.coin !== req.payload.currency) {

    return Boom.badRequest(`oracle not authorized for coin ${req.payload.currency}`);

  }

  let channel = await awaitChannel();

  req.payload.amount = parseFloat(req.payload.amount);

  let buffer = new Buffer(JSON.stringify(req.payload));

  await channel.publish('anypay.payments', 'payment', buffer);

  return { success: true };

}

