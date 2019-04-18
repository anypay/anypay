
import { awaitChannel } from '../../../lib/amqp';
import { log } from '../../../lib';

export async function create(req, h) {

  let channel = await awaitChannel();

  let buffer = new Buffer(JSON.stringify(req.payload));

  await channel.publish('anypay.payments', 'payment', buffer);

  return;

}

