

import { getChannel } from 'rabbi'

export default async function initialize() {

  const channel = await getChannel()

  await channel.assertExchange('anypay')

  await channel.assertExchange('rabbi')

}
