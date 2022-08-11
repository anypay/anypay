
require('dotenv').config()

import { join } from 'path'

import { config } from './lib/config'

import { log } from './lib'

import { startActorsDirectory } from 'rabbi';

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { start as startFees } from './actors/detect_fees/actor'

import { plugin as websockets } from './ws/plugin'

import { hapi as kraken } from './plugins/kraken'

import { start as refunds } from './actors/refunds/actor'

import { init } from 'rabbi'

import * as core from './lib'

(async () => {

  await init()

  startPrices()

  startFees()

  if (config.get('websockets_server_enabled')) {

    await server.register(websockets)

  }

  try {

    await start()

  } catch(error) {

    console.error(error)

  }

  if (config.get('KRAKEN_PLUGIN')) {

    await server.register({

      plugin: kraken, 

      options: { core }

    })

    startActorsDirectory(join(__dirname, 'plugins/kraken/actors'))

    refunds()

    log.info('rabbi.kraken.actors.start')
    
  }

})()

