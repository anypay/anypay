require('dotenv').config();

import { connect } from 'amqplib';

import { log } from '../../../lib/logger';

import { forwardPayment } from '../lib/forwards';

const queue = 'bch.forwarder.payments';

const exchange = 'anypay.payments';

const routingKey = 'payment';

async function start() {

  let connection = await connect(process.env.AMQP_URL); 

  let channel = await connection.createChannel();

  await channel.assertQueue(queue);

  await channel.bindQueue(queue, exchange, routingKey);

  await channel.prefetch(1);

  channel.consume(queue, async (message) => {
    
    let content = message.content.toString('hex');

    let payment = JSON.parse(content);
    
    log.info(queue, payment);

    if (payment.currency !== 'BCH') {

      channel.ack(message);

      return;

    }

    try {

      await forwardPayment(payment);

      channel.ack(message);

    } catch (error) {

      channel.nack(message);

      return;
    }

  });

}

export {
  start
};

if (require.main === module) {

  start();

}

