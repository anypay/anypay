
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
 * required:
 *
 * - AMQP_URL_NEW
 * - AMQP_URL_OLD
 *
 * optional:
 *
 * - AMQP_QUEUE_NEW
 * - AMQP_QUEUE_OLD
 *
 */

require('dotenv').config();

import {connect, Channel, Connection} from 'amqplib';

const AMQP_QUEUE_NEW = process.env.AMQP_QUEUE_NEW || 'invoices:paid';
const AMQP_QUEUE_OLD = process.env.AMQP_QUEUE_OLD || 'invoices:paid';

async function start() {

  let newAMQPConnection: Connection = await connect(process.env.AMQP_URL_NEW);

  let oldAMQPConnection: Connection = await connect(process.env.AMQP_URL_OLD);

  let oldChannel: Channel = await oldAMQPConnection.createChannel();

  let newChannel: Channel = await newAMQPConnection.createChannel();

  newChannel.consume(AMQP_QUEUE_NEW, async (msg) => {

    console.log('new channel message', msg.content.toString());

    await oldChannel.sendToQueue(AMQP_QUEUE_OLD, msg.content);

    await newChannel.ack(msg);
  
  });

}

export {
  start
};

if (require.main === module) {

  start();

}

