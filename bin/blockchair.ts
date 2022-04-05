#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import { publish } from '../lib/blockchair'

program
  .command('broadcast <currency> <rawtx>')
  .action(async (currency, rawtx) => {

    try {

      let result = await publish(currency, rawtx)

      console.log(result)

    } catch(error) {

      console.error(error)

    }

  })

program.parse(process.argv)
