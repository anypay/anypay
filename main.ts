
require('dotenv').config()

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { plugin as websockets } from './ws/plugin'

import { init } from 'rabbi'

(async () => {

  await init()

  startPrices()

  if (process.env.WEBSOCKETS_SERVER) {

    await server.register(websockets)

  }

  await start()

})()

