
const rabbi = require('rabbi');

const exchange = process.env.WALLETBOT_AMQP_EXCHANGE || 'anypay.walletbot';

import { ZodObject } from 'zod';

const schemas: { [key: string]: ZodObject<any> } = {}

export const topics: string[] = []

export function registerSchema(name: string, schema: ZodObject<any>) {
    schemas[name] = schema;
    topics.push(name);
}

export async function publish(topic: string, payload: any) {

    const schema = schemas[topic];

    if (schema) {

        try {

            schema.parse(payload);
      
        } catch(error: any) {
      
            console.log(error);
      
            throw new Error(error);
      
        }

    } else {

        throw new Error(`schema for topic ${topic} not yet registered`)

    }

    return rabbi.publish(exchange, topic, {
        topic, payload
    })
}

export async function setup() {
    const channel = await rabbi.getChannel()
    await channel.assertExchange(exchange, 'direct', { durable: true });
}

export { exchange }