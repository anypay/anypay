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

if (!process.env.ZEROMQ_URL) {

  console.log('ZEROMQ_URL environment variable required');

  process.exit(1);

}

sock.connect(process.env.ZEROMQ_URL);

sock.subscribe('rawtx');

console.log(`zeromq socket connected to ${process.env.ZEROMQ_URL}`);

console.log(`zeromq socket subscribed to rawtx`);

async function start() {

  var conn = await amqp.connect(process.env.AMQP_URL)

  console.log('amqp connected');

  var channel = await conn.createChannel();

  await channel.assertQueue(PAYMENT_QUEUE, { durable: true })

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {

      case 'rawtx':

        await channel.publish('anypay', 'bch:rawtx', msg);

        console.log(`bch:rawtx ${msg.toString('hex')}`);

      }
  });

}

export { start };

if (require.main === module) {

  start();

}

