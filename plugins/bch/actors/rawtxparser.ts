import * as zmq from 'zeromq';

var sock = zmq.socket('sub');

import {rawTxToPayment} from '../lib/rawtx_to_payment';

require("dotenv").config();

const port = process.env.PORT || 28332;
const RpcClient = require('bitcoind-rpc-dash');
const amqp = require('amqplib');

let events = {
  bind: {
    'bch.rawtx': {
      queue: process.env.AMQP_QUEUE || 'bch:rawtx'
    }
  },
  publish: {
    'bch.payments': {
      exchange: process.env.AMQP_EXCHANGE || 'anypay',
      routingkey: process.env.AMQP_ROUTING_KEY || 'bch.payments'
    }
  }
}

async function start(): Promise<any> {

  var rpc = new RpcClient({
    protocol: 'http',
    user: process.env.BCH_RPC_USER,
    pass: process.env.BCH_RPC_PASSWORD,
    host: process.env.BCH_RPC_HOST,
    port: process.env.BCH_RPC_PORT
  });

  var conn = await amqp.connect(process.env.AMQP_URL)

  console.log('amqp connected');

  var channel = await conn.createChannel();

  channel.consume(events.bind['bch.rawtx'].queue, (msg) => {

    let rawtx = msg.content.toString('hex');

    console.log("received rawtx", rawtx);

      rpc.decodeRawTransaction(rawtx, async function(err, txjson) {

        if (err) {

          console.log(`decoded raw tx error ${rawtx}`, err);

          return channel.ack(msg);

        } else {

          console.log(`decoded raw tx ${rawtx}`, JSON.stringify(txjson));

          try {

            var payments = rawTxToPayment(txjson);
            
            for (var i=0; i < payments.length; i++) {
              let payment = payments[i];
              console.log('payment', payment);

              await channel.publish(
                events.publish['bch.payments'].exchange,
                events.publish['bch.payments'].routingkey,
                new Buffer(JSON.stringify(payment))
              );
            }

            channel.ack(msg); 

          } catch(error) {

            console.log('error parsing payment', error.message);

            channel.nack(msg);

          }

        }

      });

  });

  return;

};

// all actors export a `start` function
export {
  start
}

// all actors execute `start` automatically if they are run directly with node
if (require.main === module) {

  start();

}

