import {connect, Connection, Channel} from 'amqplib';

import { Schema } from 'joi';

var connection: Connection;
var channel: Channel;

var channelIsConnected = false;

const exchange  = process.env.ANYPAY_AMQP_EXCHANGE ? String(process.env.ANYPAY_AMQP_EXCHANGE) : 'anypay';

export { exchange }

function wait(ms: number) {

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

export async function publish(routingKey: string, json={}) {

  let channel = await awaitChannel();

  const schema = getSchema(routingKey);

  if (schema) {

    const { error } = schema.validate(json);

    if (error) {

      throw new Error(`Validation error: ${error.details.map((x: { message: any; }) => x.message).join(', ')}`);

    }

  } else {
      
      throw new Error(`No schema found for routingKey: ${routingKey}`);
      
  }

  return channel.publish(exchange, routingKey, Buffer.from(
    JSON.stringify(json)
  ));
}


const schemas: { [key: string]: Schema } = {}

export function registerSchema(name: string, schema: Schema) {
    if (schemas[name]) {
        throw new Error(`Schema with name ${name} already exists`);
    }
    schemas[name] = schema;
}

export const getSchema = (name: string) => schemas[name];

(async function() {

  if (process.env.NODE_ENV === 'test') {

    connection = await connect(String(process.env.TEST_AMQP_URL));

  } else {

    connection = await connect(String(process.env.AMQP_URL));
  }
 
  channel = await connection.createChannel();  

  await channel.assertExchange(exchange, 'direct')

  channelIsConnected = true;
  
})();
  
export {
 
  connection, channel, awaitChannel, wait

}
