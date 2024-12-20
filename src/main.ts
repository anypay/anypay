
require('dotenv').config()

import { config } from '@/lib'

import { log } from '@/lib'

import { start as startPrices } from '@/lib/prices/cron'

import { start as startFees } from '@/actors/detect_fees/actor'

import { start as refunds } from '@/actors/refunds/actor'

import { startConfirmingTransactions } from '@/lib/confirmations'

import prisma from '@/lib/prisma';

import { AnypayServer } from './anypay_server';

(async () => {

  console.log("Starting anypay server")

  const anypayServer = new AnypayServer({
    amqp: {
      url: config.get('AMQP_URL'),
      exchange: config.get('AMQP_EXCHANGE')
    },
    http: {
      port: config.get('PORT'),
      host: config.get('HOST')
    },
    websockets: {
      host: config.get('WEBSOCKETS_HOST'),
      port: config.get('WEBSOCKETS_PORT')
    },
    webhooks: true,
    log,
    prisma
  })

  console.log("Starting anypay server 2")

  try {

    anypayServer.start()

    console.log("Anypay server started 3")

  } catch(error: any) {

    log.error('anypayServer.start.error', error)

  }


  startPrices()

  console.log("Prices cron started!")

  startFees()

  console.log("Fees started!")

  refunds()

  console.log("Refunds started!")

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

