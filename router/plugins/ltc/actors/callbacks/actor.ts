
import { channel, exchange, awaitChannel } from '../../lib/events';

import { sendWebhook } from '../../lib/callbacks';

const queue = 'callbacks';
const routingKey = 'addressforwardcallback.created';

const models = require('../../models');

async function start() {

  await awaitChannel();

  console.log('channel connected');

  await channel.assertExchange(exchange, 'direct');

  await channel.assertQueue(queue);

  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, async (message) => {

    let callback = JSON.parse(message.content.toString());

    console.log('process callback', callback);

    let addressForward = await models.AddressForward.findOne({

      where: {

        input_address: callback.input_address

      }

    });

    if (!addressForward.callback_url) {

      console.log(`no callback url set for forward ${addressForward.id}`);

      await channel.ack(message);

      return;

    }

    try {

      let resp = await sendWebhook(addressForward.callback_url, callback);

      console.log('webhook.sent', resp.body);

      channel.ack(message);

    } catch(error) {

      console.log(error.message, error.response.body.error.message);

      channel.ack(message);

    }
  
  });



}

if (require.main === module) {

  start();

}

export {

  start

}
