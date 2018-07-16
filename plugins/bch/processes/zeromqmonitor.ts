import * as zmq from 'zeromq';

var sock = zmq.socket('sub');

import {rawTxToPayment} from '../lib/rawtx_to_payment';

require("dotenv").config();

const port = process.env.PORT || 28332;
const RpcClient = require('bitcoind-rpc-dash');
const bitcore = require('bitcore');
const amqp = require('amqplib');

const PAYMENT_QUEUE  = "anypay:payments:received";

var rpc = new RpcClient({
  protocol: 'http',
  user: process.env.RPC_USER,
  pass: process.env.RPC_PASSWORD,
  host: process.env.RPC_HOST,
  port: process.env.RPC_PORT
});

var zeromqHost = process.env.ZEROMQ_HOST;
var zeromqPort = process.env.ZEROMQ_PORT;

if (!process.env.ZEROMQ_URL) {
  console.log('ZEROMQ_URL environment variable required');
  process.exit(1);
}

sock.connect(process.env.ZEROMQ_URL);
sock.subscribe('hashtx');
sock.subscribe('rawtx');
console.log(`Worker connected to ${process.env.ZEROMQ_HOST}`);

(async function() {

  var conn = await amqp.connect(process.env.AMQP_URL)

  console.log('amqp connected');

  var channel = await conn.createChannel();

  await channel.assertQueue(PAYMENT_QUEUE, { durable: true })

  sock.on('message', async function(topic, msg){

    switch(topic.toString()) {
      case 'hashtx':

        await channel.publish('anypay', 'bch:hashtx', msg);
        await console.log(`bch:hashtx ${msg.toString('hex')}`);

        /*
        var txhash = msg.toString('hex');
        rpc.getTransaction(txhash, function(err, tx) {
          if (tx && tx.result) {
            console.log('WALLET TX!',JSON.stringify(tx));
          }
        })
         */
        break;
      case 'rawtx':

        await channel.publish('anypay', 'bch:rawtx', msg);
        await console.log(`bch:rawtx ${msg.toString('hex')}`);

        /*
        rpc.decodeRawTransaction(msg.toString('hex'), function(err, rawtx) {
          if (err) {
            console.log('decoded raw tx error', err);
          } else {
            console.log('decoded raw tx', JSON.stringify(rawtx));
            try {
              var payment = rawTxToPayment(rawtx);
              channel.sendToQueue(PAYMENT_QUEUE, new Buffer(
                JSON.stringify(payment)
              ));
            } catch(error) {
              console.log('error parsing payment', error.message);
            }
          }
        });
         */
      }
  });

})();

async function handleRawtx(rawtx: string): Promise<any> {


}

async function handleHashtx(txhash: string): Promise<any> {


}

