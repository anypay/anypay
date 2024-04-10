
require('dotenv').config()

import { config } from './lib/config'

import { log } from './lib'

import { init } from 'rabbi';

import { server, start } from './server/v0/server'

import { start as startPrices } from './lib/prices/cron'

import { start as startFees } from './actors/detect_fees/actor'

import { plugin as websockets } from './server/ws/plugin'

import { start as refunds } from './actors/refunds/actor'

import { startConfirmingTransactions } from './lib/confirmations'

import prisma from './lib/prisma';

import { AnypayServer } from './src/anypay_server';

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

  refunds()

  const anypayServer = new AnypayServer({
    webhook_server: {
      amqp: {
          url: config.get('AMQP_URL'),
          exchange: config.get('ANYPAY_AMQP_EXCHANGE')
      },
    },
    log,
    prisma
  })

  anypayServer.start()

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
