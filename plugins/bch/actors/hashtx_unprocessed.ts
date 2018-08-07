
require("dotenv").config();

import {lookupHashTx} from '../lib/lookup_hash_tx';

import * as amqp from 'amqplib';

import {notifySlack} from '../lib/slack';

const queue = 'anypay.bch.hashtx';
const exchange = 'anypay.bch';

async function start() {

  const connection = await amqp.connect(process.env.AMQP_URL); 

  const channel = await connection.createChannel();

  await channel.prefetch(1);

  await channel.assertQueue('anypay.bch.tx');

  await channel.bindQueue(`anypay.bch.tx`, exchange, `bch.tx`);

  channel.consume(queue, async (message) => {

    try {

      let content = message.content.toString('hex');
      
      console.log('anypay.bch.hashtx', content);

      let tx = await lookupHashTx(content);

      await channel.publish(exchange, 'bch.tx', new Buffer(JSON.stringify(tx)));

      await channel.ack(message);

      await notifySlack(queue, content);

    } catch(error) {

      console.error('error', error.message);

      return channel.ack(message);


    }

  });

}

export {
  start
};

if (require.main === module) {

  start();

}

