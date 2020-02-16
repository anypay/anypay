
require('dotenv').config();

import { log } from './logger';

import { connect, Connection, Channel } from 'amqplib';

var channel: Channel;
var connection: Connection;
var channelIsConnected = false;

const exchange = 'ltc.anypay.global';

function wait(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });

}

export async function awaitChannel() {

  while(!channelIsConnected) {

    await wait(100);

  } 

  return channel;

}

(async function() {

  let connection = await connect(process.env.AMQP_URL);

  channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'direct');

  console.log("CHANNEL CONNECTED");

  channelIsConnected = true;

})();

export async function publishEvent(key: string, payload: any) {

  log.info(key, payload);

  if (typeof payload !== 'string') {

    payload = JSON.stringify(payload);

  }

  await channel.publish(exchange, key, new Buffer(payload));

}

export {

  channel,

  exchange

}

