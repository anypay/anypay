import {connect, Connection, Channel} from 'amqplib';

var connection: Connection;
var channel: Channel;

import { config } from './config'

var channelIsConnected = false;

function wait(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });

}

async function awaitChannel() {

  while (!channelIsConnected) {

    await wait(100);

  }

  return channel;

}

export async function publishEvent(type: string, payload: any={}) {

  return publish(type, payload, 'anypay.topic')
}

export async function publish(routingKey: string, json={}, exchange: string='anypay.events') {

  let channel = await awaitChannel();

  return publishJson(channel, exchange, routingKey, json);
}

export async function publishJson(channel, exchange, routingkey, json) {
  return channel.publish(exchange, routingkey, Buffer.from(
    JSON.stringify(json)
  ));
}

(async function() {

  connection = await connect(config.get('amqp_url'));

  channel = await connection.createChannel();  

  await channel.assertExchange('anypay.events', 'direct')

  await channel.assertExchange('anypay:invoices', 'direct')

  await channel.assertExchange('rabbi.events', 'direct')

  await channel.assertExchange('anypay.topic', 'topic')

  channelIsConnected = true;
  
})();
  
export {
 
  connection, channel, awaitChannel, wait

}
