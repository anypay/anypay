import * as zmq from 'zeromq';

var sock = zmq.socket('sub');

import {rawTxToPayment} from '../lib/rawtx_to_payment';

require("dotenv").config();

const port = process.env.PORT || 28332;
const RpcClient = require('bitcoind-rpc-dash');
const amqp = require('amqplib');

const PAYMENT_QUEUE  = "anypay:payments:received";


async function start(): Promise<any> {

  var rpc = new RpcClient({
    protocol: 'http',
    user: process.env.RPC_USER,
    pass: process.env.RPC_PASSWORD,
    host: process.env.RPC_HOST,
    port: process.env.RPC_PORT
  });

  var conn = await amqp.connect(process.env.AMQP_URL)

  console.log('amqp connected');

  var channel = await conn.createChannel();

  await channel.assertQueue(PAYMENT_QUEUE, { durable: true })

  channel.consume('bch:rawtx', (msg) => {

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

              await channel.publish('anypay', 'bch:payments', new Buffer(
                JSON.stringify(payment)
              ));
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

