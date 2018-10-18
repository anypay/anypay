require("dotenv").config();

import * as zmq from 'zeromq';
import * as amqp from 'amqplib';

/*
 *
 * Bitcoin Cash full node payment monitoring with Zeromq. This
 * actor establishes a zeromq socket connection with the bitcoin
 * cash full node over tcp, from which raw transaction information
 * is streamed in real time.
 *
 * If the tcp socket disconnects transactions will be lost, and this
 * actor makes no attempt to recover missed transactions.
 *
 *
 */

if (!process.env.ZEROMQ_URL) {

  console.log('ZEROMQ_URL environment variable required');

  process.exit(1);

}

var sock = zmq.socket('sub');

sock.connect(process.env.ZEROMQ_URL);

/*
 * Actor Events are published from actors to the AMQP message broker
 * where other actors listen to such events and behave accordingly.
 *
 * This zeromqmonitor module publishes the following events:
 *
 *  - bch.rawtx
 *  - bch.rawblock
 *  - bch.hashtx
 *  - bch.hashblock
 */

const events = [

  //'rawtx',

  //'rawblock',

  'hashtx'//,

  //'hashblock'

];

events.forEach(event => {

  sock.subscribe(event);

  console.log(`zeromq socket subscribed to ${event}`);

});

/*
 * bch.rawtx event indicates to the system that the bitcoincash full
 * node has received a valid transaction on the p2p network. This
 * actor publishes the raw transaction data buffer to AMQP.
 *
 * bch.rawtx may be configured by providing the AMQP_ROUTING_KEY and
 * AMQP_EXCHANGE environment variables at runtime.
 *
 */

const exchange = process.env.AMQP_EXCHANGE || 'anypay.bch';

async function start() {

  const conn = await amqp.connect(process.env.AMQP_URL);

  console.log('amqp connected');

  const channel = await conn.createChannel();

  await channel.assertExchange(exchange, 'direct');

  events.forEach(async event => {

    await channel.assertQueue(`anypay.bch.${event}`);

    await channel.bindQueue(`anypay.bch.${event}`, exchange, `bch.${event}`);

  });

  sock.on('message', async function(topic, msg){

    let event = `bch.${topic.toString()}`;

    console.log("publish event", event);

    await channel.publish(exchange, event, msg, {
      expiration: 10000 // expires after ten seconds
    });

    console.log(`${event} ${msg.toString('hex')}`);

  });

}

export {
  start
};

if (require.main === module) {

  start();

}

