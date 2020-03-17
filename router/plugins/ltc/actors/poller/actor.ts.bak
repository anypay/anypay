
import { pollAddressForPayments, getMemPoolTxs } from '../../lib/';

import { channel, exchange, awaitChannel } from '../../lib/events';

import { sendWebhook } from '../../lib/callbacks';

const queue = 'addresspollers';
const routingKey = 'addressforward.created';

async function start() {

  await awaitChannel();

  await channel.assertExchange(exchange, 'direct');

  await channel.assertQueue(queue);

  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, async (message) => {

    let forward = JSON.parse(message.content.toString());

    pollAddressForPayments(forward.input_address);

    channel.ack(message);

  });

  setInterval(async () => {

    let routingKey = 'transaction.created';

    let txns = await getMemPoolTxs();

    for (let i=0; i < txns.length; i++) {

      await channel.publish(exchange, routingKey, new Buffer(txns[i]));

      console.log('published tx', txns[i]);

    }

  }, 30000);

}

if (require.main === module) {

  start();

}

export {

  start

}
