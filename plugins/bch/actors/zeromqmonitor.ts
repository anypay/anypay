import * as zmq from 'zeromq';

var sock = zmq.socket('sub');

import {rawTxToPayment} from '../lib/rawtx_to_payment';

require("dotenv").config();

const port = process.env.PORT || 28332;

const RpcClient = require('bitcoind-rpc-dash');

const amqp = require('amqplib');

const PAYMENT_QUEUE  = "anypay:payments:received";

var rpc = new RpcClient({

  protocol: 'http',

  user: process.env.RPC_USER,

  pass: process.env.RPC_PASSWORD,

  host: process.env.RPC_HOST,

  port: process.env.RPC_PORT

});

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

sock.connect(process.env.ZEROMQ_URL);

sock.subscribe('rawtx');

console.log(`zeromq socket connected to ${process.env.ZEROMQ_URL}`);

console.log(`zeromq socket subscribed to rawtx`);

/*
 * Actor Events are published from actors to the AMQP message broker
 * where other actors listen to such events and behave accordingly.
 *
 * This zeromqmonitor module publishes the following events:
 *
 *  - bch.rawtx
 *
 * bch.rawtx event indicates to the system that the bitcoincash full
 * node has received a valid transaction on the p2p network. This
 * actor publishes the raw transaction data buffer to AMQP.
 *
 * bch.rawtx may be configured by providing the AMQP_BINDING_KEY and
 * AMQP_EXCHANGE environment variables at runtime.
 *
 */

let events = {

  'bch.rawtx': {

    exchange: process.env.AMQP_EXCHANGE || 'anypay',

    bindingkey: process.env.AMQP_BINDING_KEY || 'bch:ratx'

  }

};

async function start() {

  var conn = await amqp.connect(process.env.AMQP_URL)

  console.log('amqp connected');

  var channel = await conn.createChannel();

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {

      case 'rawtx':

        await channel.publish(events['bch.rawtx'].exchange, events['bch.rawtx'].bindingkey, msg);

        console.log(`bch:rawtx ${msg.toString('hex')}`);

      }
  });

}

export {
  start,
  events
};

if (require.main === module) {

  start();

}

