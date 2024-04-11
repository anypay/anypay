
require('dotenv').config()

import { config } from './lib/config'

import { log } from './lib'

import { init } from 'rabbi';

import { start as startPrices } from './lib/prices/cron'

import { start as startFees } from './actors/detect_fees/actor'

import { start as refunds } from './actors/refunds/actor'

import { startConfirmingTransactions } from './lib/confirmations'

import prisma from './lib/prisma';

import { AnypayServer } from './src/anypay_server';


(async () => {

  await init()

  const anypayServer = new AnypayServer({
    amqp: {
      url: config.get('ANYPAY_AMQP_URL'),
      exchange: config.get('ANYPAY_AMQP_EXCHANGE')
    },
    http: {
      port: config.get('ANYPAY_HTTP_PORT'),
      host: config.get('ANYPAY_HTTP_HOST')
    },
    websockets: {
      host: config.get('ANYPAY_WEBSOCKETS_HOST'),
      port: config.get('ANYPAY_WEBSOCKETS_PORT')
    },
    webhooks: true,
    log,
    prisma
  })

  anypayServer.start()

  startPrices()

  startFees()

  refunds()

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
