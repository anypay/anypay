require('dotenv');

import * as Boom from 'boom';
import { awaitChannel } from '../../../lib/amqp';
import { log } from '../../../lib/logger';

export async function create(req, h) {

  try {

    const { secret, payment } = req.payload;

    if (secret !== process.env.MONEYBUTTON_WEBHOOK_SECRET) {
      throw new Error('invalid moneybutton webhook secret');
    }

    log.info('moneybutton_webhook', payment);

    const channel = await awaitChannel();

    channel.publish('anypay.events', 'moneybutton_webhook', Buffer.from(
      JSON.stringify(payment) 
    ))

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

