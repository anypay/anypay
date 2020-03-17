
import { channel, exchange, awaitChannel } from '../../lib/events';

const queue = 'transactions';
const routingKey = 'transaction.created';

import { forwardPayment } from '../../lib/forwarder';

async function start() {

  await awaitChannel();

  console.log('channel connected');

  await channel.assertExchange(exchange, 'direct');

  await channel.assertQueue(queue);

  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, async (message) => {

    let txid = message.content.toString();

    console.log('process tx', txid);

    try {

      let callback = await forwardPayment(txid);

      console.log(callback);

      channel.ack(message);

    } catch(error) {

      console.log(error.message);

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

