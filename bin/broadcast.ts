#!/usr/bin/env ts-node

import * as program from 'commander'

import { broadcast } from '../lib/pay'

program
  .command('tx <currency> <hex>')
  .action(async (currency, hex) => {

    try {

      let resp = await broadcast(currency, hex)

      console.log(resp)

    } catch(error) {

      console.log(error)

    }

    process.exit(0)

  })

program.parse(process.argv)
