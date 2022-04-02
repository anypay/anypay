
require('dotenv').config()

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { plugin as websockets } from './ws/plugin'

import { hapi as kraken } from './plugins/kraken'

import { init } from 'rabbi'

(async () => {

  await init()

  startPrices()

  if (process.env.WEBSOCKETS_SERVER) {

    await server.register(websockets)

  }

  if (process.env.KRAKEN_PLUGIN) {

    await server.register(kraken)
    
  }

  await start()

})()

