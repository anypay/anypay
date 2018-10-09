
require("dotenv").config();

import {lookupHashTx} from '../lib/lookup_hash_tx';

import * as amqp from 'amqplib';

//import {notifySlack} from '../lib/slack';

const queue = 'anypay.rvn.hashtx';
const exchange = 'anypay.rvn';

async function start() {

  const connection = await amqp.connect(process.env.AMQP_URL); 

  const channel = await connection.createChannel();

  await channel.prefetch(1);

  await channel.assertQueue('anypay.rvn.tx');

  await channel.bindQueue(`anypay.rvn.tx`, exchange, `rvn.tx`);

  channel.consume(queue, async (message) => {
    var tx;

    let content = message.content.toString('hex');
    
    console.log('anypay.rvn.hashtx', content);

    try {

      tx = await lookupHashTx(content);

    } catch(error) {

      console.error(`error looking up tx ${content}`);
    }
      
    try {

      await channel.publish(exchange, 'rvn.tx', new Buffer(JSON.stringify(tx)));

      await channel.ack(message);

    } catch(error) {

      console.error('errorZ', error.message);

      await channel.ack(message);

      return;

    }

    //await notifySlack(queue, content);


  });

}

function pause(ms) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve();
    }, ms);
  });
}

export {
  start
};

if (require.main === module) {

  start();

}

