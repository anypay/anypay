

import { getChannel } from 'rabbi'

export default async function initialize() {

  console.log(process.env) //@todo: remove

  const channel = await getChannel()

  await channel.assertExchange('anypay')

  await channel.assertExchange('rabbi')

}
