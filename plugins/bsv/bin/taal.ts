#!/usr/bin/env ts-node

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { getTransaction, broadcastTransaction }  from '../lib/taal'

program 
  .command('gettransaction <txid>')
  .action(async (txid) => {

    try {

      let tx = await getTransaction(txid)

      console.log(tx)

    } catch(error) {

      console.error(error)

    }

  })

program 
  .command('broadcast <txhex>')
  .action(async (txhex) => {

    try {

      let result = await broadcastTransaction(txhex)

      console.log(result)

    } catch(error) {

      console.error(error)

    }

  })

program.parse(process.argv)

