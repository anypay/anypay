

import { getChannel } from 'rabbi'

import { exchange } from '../lib/amqp'

export default async function initialize() {

  const channel = await getChannel()

  await channel.assertExchange(exchange, 'direct')

}
