require('dotenv').config();

import { connection } from '../../lib/amqp';
import { log } from '../../lib';

function SettlementConsumer(channel) {

  return async function(message) {

    log.info('settlement', message.content.toString());

    channel.ack('message');

  }

}

async function start() {

  let channel = await connection.createChannel();

  await channel.assertQueue('settlements', { durable: true });

  await channel.bindQueue('settlements', 'anypay.invoices', 'invoice.paid');

  let consumer = SettlementConsumer(channel);

  channel.consume('settlements', consumer, { noAck: false });

}

export {
  start
}
