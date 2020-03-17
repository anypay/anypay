
import { pollAddressForPayments } from '../../lib/';

import { channel, exchange, awaitChannel } from '../../lib/events';

import { sendWebhook } from '../../lib/callbacks';

import * as http from 'superagent';

const queue = 'errors';
const routingKey = 'error';

async function sendErrorToSlack(error) {

  let resp = await http
    .post('https://hooks.slack.com/services/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')
    .send({
      text: error
    });

  return resp;

}

async function start() {

  await awaitChannel();

  await channel.assertExchange(exchange, 'direct');

  await channel.assertQueue(queue);

  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, async (message) => {

    let error = message.content.toString();

    console.error("ERROR", error);

    await sendErrorToSlack(error);

    channel.ack(message);

  });

}

if (require.main === module) {

  start();

}

export {

  start

}
