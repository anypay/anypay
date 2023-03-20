#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();


import { publish } from '../lib/blockcypher'

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
