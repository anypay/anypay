#!/usr/bin/env ts-node

require('dotenv').config()

const { version } = require('../../package')

import config from '../config'

import log from '../log'

import { program } from 'commander'

import { listBalances } from '../balances'

import { createInvoice } from '../invoices'

import { start } from '../main'

import { existsSync, writeFileSync } from 'fs'

import { getBitcore } from '../wallet'

import { initWalletFromMnemonic } from '..'


program
  .version(version)
  .option('--config <path>')
  .option('--host <ipaddress>')
  .option('--port <integer>')
  .option('--prometheus_enabled <boolean>')
  .option('--amqp_enabled <boolean>')
  .option('--http_api_enabled <boolean>')
  .option('--swagger_enabled <boolean>')
  .option('--postgres_enabled <boolean>')
  .option('--database_url <connection_string>')
  .option('--amqp_url <connection_string>')
  .option('--amqp_exchange <name>')
  .option('--amqp_enabled <boolean>')

program
  .command('start')
  .action(async () => {

    start()

  })

program
  .command('balances')
  .action(async () => {

    try {

      const wallet = await initWalletFromMnemonic()

      let balances = await wallet.balances()

      console.log(balances)

      process.exit(0)

    } catch(error) {

      log.error('cli.listbalances', error)

      process.exit(1)

    }

  })

program
  .command('payinvoice <uri> <currency>')
  .action(async (uri, currency) => {

    try {

      const wallet = await initWalletFromMnemonic()

      //await wallet.balances

      const result = await wallet.payUri(uri, currency)

      console.log(result)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('balance <currency>')
  .action(async (currency) => {

    console.log(`show ${currency} balance`)

    const wallet = await initWalletFromMnemonic()

    console.log(wallet.balances)

    process.exit(0)

  })

program
  .command('newinvoice')
  .requiredOption('-c, --currency <currency>', 'coin to collect')
  .requiredOption('-a, --address <address>', 'crypto receiving address')
  .requiredOption('-v, --value <value>', 'amount to collect', (value) => parseFloat(value))
  .option('-d, --denomination <currency>', 'base currency for value ie USD, EUR, JPY, BRL', 'USD')
  .action(async (options) => {

    const { currency ,address, value, denomination } = options

    const invoice = await createInvoice({

      currency, address, value, denomination

    })

    console.log(invoice)

    process.exit(0)

  })



import { connect } from '../socket.io'

program
  .command('socket.io [token]')
  .action(async (token) => {

    try {

      let socket = await connect(token)

    } catch(error) {

      console.log('error', error)

    }

  })



program
  .command('new_wallet [filepath]')
  .action((filepath) => {


    const json = {
      "anypay_api_token": config.get('anypay_api_token'),
      "cards": [{
        "asset": "BSV",
        "privatekey": getBitcore('BSV').PrivateKey().toWIF()
      }, {
        "asset": "BTC",
        "privatekey": getBitcore('BTC').PrivateKey().toWIF()
      }, {
        "asset": "BCH",
        "privatekey": getBitcore('BCH').PrivateKey().toWIF()
      }, {
        "asset": "DASH",
        "privatekey": getBitcore('DASH').PrivateKey().toWIF()
      }, {
        "asset": "LTC",
        "privatekey": getBitcore('LTC').PrivateKey().toWIF()
      }, {
        "asset": "DOGE",
        "privatekey": getBitcore('DOGE').PrivateKey().toWIF()
      }]
    }

    if (filepath) {

      if (existsSync(filepath)) {

        console.error(`file at ${filepath} already exists`)

        process.exit(1)

      }

      writeFileSync(filepath, JSON.stringify(json, null, 2))

      console.log(`New wallet config json written to ${filepath}`)

    } else {

      console.log(JSON.stringify(json, null, 2))

    }

    process.exit(0)

  })

program.parse(process.argv)

