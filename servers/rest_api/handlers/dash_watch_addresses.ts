
import { badRequest } from 'boom';

import { channel, awaitChannel } from '../../../lib/amqp';

export async function create(req, h) {

  try {

    await awaitChannel();

    switch(req.account.email) {

    case 'lorenzo@dashtext.io':

      break;

    case 'steven@anypay.global':

      break;

    default:

      console.log('not authorized');

      return {succes: false}

    }

    let buffer = Buffer.from(JSON.stringify({
      account_email: req.account.email,
      address: req.payload.address
    }))

    await channel.publish('anypay.payments', 'addresses.watch', buffer);

    return { success: true }

  } catch(error) {

    return badRequest(error)

  }

}
