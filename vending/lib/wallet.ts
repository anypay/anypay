
require('dotenv').config();

import * as uuid from 'uuid';

import { connect } from 'amqplib';

export function sendtoaddress(address: string, amount: number) {

  return new Promise(async (resolve, reject) => {

    let connection = await connect(process.env.AMQP_URL);

    let channel = await connection.createChannel();
    //remember to close the channel when finished

    let uid = uuid.v4(); 
    let errorUid = uuid.v4(); 

    let message = JSON.stringify({

      address: address,

      amount: amount,

      uid

    })

    let queue = `bsv.sendtoaddress.response.${uid}`;
    let errorQeueue = `bsv.sendtoaddress.error.${uid}`;

    await channel.assertQueue(queue, {

      autoDelete: true,

      durable: false

    });

    await channel.assertQueue(errorQeueue, {

      autoDelete: true,

      durable: false

    });

    channel.consume(queue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(uid);

      await channel.close();

      resolve(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: uid

    })

    channel.consume(errorQeueue, async (msg) => {

      await channel.ack(msg);

      // close consumer and delete queue
      await channel.cancel(errorUid);

      await channel.close();

      reject(msg.content.toString());

    }, {

      exclusive: true,

      consumerTag: errorUid

    })

    channel.publish('anypay.vending', 'bsv.sendtoaddress', Buffer.from(message))

  });

}

