
/*
 * Temporary AMQP Connector
 *
 * This actor pulls messages about paid invoices from
 * the new amqp server and sends them into the 
 * legacy amqp server.
 *
 * The reason for this is to allow current invoices to
 * receive a websocket notification that they were paid
 * even when the payment was processed by a payment
 * processor actor connected to the new amqp server.
 *
 * Delete this actor once all processes are migrated to
 * the new amqp server.
 *
 * =====================
 * Environment Variables
 * ---------------------
 *
 * - AMQP_URL_NEW
 * - AMQP_URL_OLD
 * - AMQP_EXCHANGE_OLD
 * - AMQP_EXCHANGE_NEW
 * - AMQP_QUEUE_NEW
 * - AMQP_QUEUE_OLD
 *
 */

import {connect, Channel, Connection} from 'amqplib';

var newAMQPConnection: Connection;

var oldAMQPConnection: Connection;

const AMQP_QUEUE_NEW = process.env.AMQP_QUEUE_NEW || '';

async function start() {

  newAMQPConnection: Connection = await connect(process.env.AMQP_URL_NEW);

  oldAMQPConnection: Connection = await connect(process.env.AMQP_URL_OLD);

  let oldChannel: Channel = await oldAMQPConnection.createChannel();

  let newChannel: Channel = await newAMQPConnection.createChannel();

  newChannel.consume(AMQP_QUEUE_NEW, async (msg) => {

    await oldChannel.sendToQueue(AMQP_EXCHANGE_OLD, AMQP_QUEUE_OLD);

    await newChannel.ack(msg);
  
  });

}

export {
  start
};

if (require.main === module) {

  start();

}

