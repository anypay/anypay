
require('dotenv').config()

import { findOne } from '../lib/orm'

import { republishEventToRoutingKeys, Event } from '../lib/events'

async function main() {

  const event = await findOne<Event>(Event, {
    where: {
      id: process.argv[2]
    }
  })

  console.log('republishing event', event.toJSON())

  await republishEventToRoutingKeys(event)

  console.log('event republished', event.toJSON())

}

main()

