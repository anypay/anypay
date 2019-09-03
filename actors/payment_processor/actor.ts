require('dotenv').config();

const amqp = require("amqplib");

import { Connection, connect, Channel, Message } from 'amqplib';

import { log, models } from '../../lib';

import {PaymentConsumer} from '../../servers/processor/payments/main'

const AMQP_URL = process.env.AMQP_URL;

const PAYMENT_QUEUE  = "anypay:payments:received";

async function start() {
        
  amqp.connect(AMQP_URL).then(async (conn: Connection) => {

    let channel: Channel = await conn.createChannel()

    log.info("amqp:channel:connected");

    await channel.assertQueue(PAYMENT_QUEUE, { durable: true });

    await channel.assertExchange('anypay', 'fanout');

    await channel.assertExchange('anypay.payments', 'direct');

    await channel.assertExchange('anypay:invoices', 'direct');

    await channel.bindQueue(PAYMENT_QUEUE, 'anypay.payments', 'payment');

    let consumer = PaymentConsumer(channel);

    log.info('consume channel', PAYMENT_QUEUE);

    channel.consume(PAYMENT_QUEUE, consumer, { noAck: false });

  })
  .catch(error => {

    log.error(error.message);

  });

}

export {

  start

}

if (require.main === module) {

  start();

}

