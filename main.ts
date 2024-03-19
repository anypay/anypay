
require('dotenv').config()

import { join } from 'path'

import { config } from './lib/config'

import { log } from './lib'

import { startActorsDirectory, init } from 'rabbi';

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { start as startFees } from './actors/detect_fees/actor'

import { hapi as kraken } from './lib/kraken'

import { plugin as websockets } from './server/ws/plugin'

import { start as refunds } from './actors/refunds/actor'

import eventWebhooks from './actors/webhooks-events/actor'

import { startConfirmingTransactions } from './lib/confirmations'

(async () => {

  await init()

  startPrices()

  startFees()

  try {

    await start()

  } catch(error) {

    console.error(error)

  }

  server.register({

    plugin: websockets

  })

  if (config.get('KRAKEN_PLUGIN')) {

    await server.register({
      plugin: kraken
    })

    startActorsDirectory(join(__dirname, 'lib/kraken/actors'))

    refunds()
    
    log.info('rabbi.kraken.actors.start')
    
  }

  eventWebhooks()

  if (config.get('start_confirming_transactions')) {

    console.log('start_confirming_transactions', config.get('start_confirming_transactions'))

    startConfirmingTransactions()

  }

})()

process.on('uncaughtException', (error) => {
  log.error('uncuaghtException', error)
})

process.on('unhandledRejected', (error) => {
  log.error('uncuaghtException', error)
})
