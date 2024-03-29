/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
import {connect, Connection, Channel} from 'amqplib';

import { config } from './config';

import { ZodObject } from 'zod';

var connection: Connection;
var channel: Channel;

var channelIsConnected = false;

const exchange  = config.get("ANYPAY_AMQP_EXCHANGE");

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

    try {

      schema.parse(json);

    } catch(error: any) {

      console.log(error);

      if (error) {

        throw new Error(`Validation error: ${error.message}`);

      }

    }


  } else {
      
      throw new Error(`No schema found for routingKey: ${routingKey}`);
      
  }

  return channel.publish(exchange, routingKey, Buffer.from(
    JSON.stringify(json)
  ));
}


const schemas: { [key: string]: ZodObject<any> } = {}

export function registerSchema(name: string, schema: ZodObject<any>) {
    if (schemas[name]) {
        throw new Error(`Schema with name ${name} already exists`);
    }
    schemas[name] = schema;
}

export const getSchema = (name: string) => schemas[name];

(async function() {

  if (config.get('NODE_ENV') === 'test') {

    connection = await connect(String(config.get('TEST_AMQP_URL')));

  } else {

    connection = await connect(String(config.get('AMQP_URL')));
  }
 
  channel = await connection.createChannel();  

  await channel.assertExchange(exchange, 'direct')

  channelIsConnected = true;
  
})();
  
export {
 
  connection, channel, awaitChannel, wait

}
