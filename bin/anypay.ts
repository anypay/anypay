#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { setAddress } from '../lib/addresses'

import { findByEmail } from '../lib/accounts'

program
  .option('-e, --email <string>')

program
  .command('set-address <currency> <address>')
  .action(async (currency, address, options) => {

    try {

      console.log({ currency, address, options })

      console.log(program.opts())

      const { email } = program.opts()

      const account = await findByEmail(email)

      let result = await setAddress(account, {
        currency,
        value: address
      })

      console.log(result)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program.parse(process.argv)
