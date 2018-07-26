
require("dotenv").config();

import * as amqp from 'amqplib';

import {notifySlack} from '../lib/slack';

const queue = 'anypay.bch.hashblock';

async function start() {

  let connection = await amqp.connect(process.env.AMQP_URL); 

  let channel = await connection.createChannel();

  channel.consume(queue, async (message) => {
    
    let content = message.content.toString('hex');
    
    console.log(queue, content);

    channel.ack(message);

    await notifySlack(queue, content);

  });

}

export {
  start
};

if (require.main === module) {

  start();

}

