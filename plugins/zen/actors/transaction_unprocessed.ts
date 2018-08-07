
require("dotenv").config();

import {rawTxToPayment} from '../lib/rawtx_to_payment';

import * as amqp from 'amqplib';

import {notifySlack} from '../lib/slack';

const queue = 'anypay.zen.tx';
const exchange = 'anypay.zen';

async function start() {

  const connection = await amqp.connect(process.env.AMQP_URL); 

  const channel = await connection.createChannel();

  await channel.prefetch(3);

  await channel.assertQueue('anypay.zen.payment');

  await channel.bindQueue(`anypay.zen.payment`, exchange, `zen.payment`);

  channel.consume(queue, async (message) => {

    let content = message.content.toString();
    
    console.log('anypay.zen.tx', content);

    let payments = await rawTxToPayment(JSON.parse(content));

    payments.forEach(async (payment) => {

      console.log('payment!', payment);

      let message = new Buffer(JSON.stringify(payment));

      await channel.publish(exchange, 'zen.payment', message);

    });
      
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

