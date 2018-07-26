
require("dotenv").config();

import * as amqp from 'amqplib';

import {notifySlack} from '../lib/slack';

const queue = 'anypay.bch.hashtx';

async function start() {

  const connection = await amqp.connect(process.env.AMQP_URL); 

  const channel = await connection.createChannel();

  await channel.prefetch(3);

  channel.consume(queue, async (message) => {

    let content = message.content.toString('hex');
    
    console.log('anypay.bch.hashtx', content);

    await channel.ack(message);

    await notifySlack(queue, content);

  });

}

export {
  start
};

if (require.main === module) {

  start();

}

