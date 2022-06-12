
require('dotenv').config()

import { join } from 'path'

import { log } from './lib'

import { startActorsDirectory } from 'rabbi';

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { plugin as websockets } from './ws/plugin'

import { hapi as kraken } from './plugins/kraken'

import { init } from 'rabbi'

import * as core from './lib'

(async () => {

  await init()

  startPrices()

  if (process.env.WEBSOCKETS_SERVER) {

    await server.register(websockets)

  }
  try {

  await start()
  } catch(error) {

    console.error(error)

  }

  if (process.env.KRAKEN_PLUGIN) {

    await server.register({

      plugin: kraken, 

      options: { core }

    })

    startActorsDirectory(join(__dirname, 'plugins/kraken/actors'))

    log.info('rabbi.kraken.actors.start')
    
  }

})()

