#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { getTransaction }  from '../lib/whatsonchain'

program 
  .command('gettransaction <txid>')
  .action(async (txid) => {

    try {

      let tx = await getTransaction(txid)

      console.log(tx)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program.parse(process.argv)

