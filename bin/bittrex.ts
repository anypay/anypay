#!/usr/bin/env ts-node

require("dotenv").config()

import * as program from 'commander'

const { BittrexClient } = require('bittrex-node')

let client = new BittrexClient({
  apiKey: process.env.BITTREX_KEY,
  apiSecret: process.env.BITTREX_SECRET
})

console.log(client)

import { marketOrder, listOrders } from '../lib/bittrex'

program
  .command('sellbsv <amount>')
  .action(async (amount) => {

    try {

      let response = await marketOrder(amount)

      console.log(response)

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .command('listordersv1')
  .action(async () => {

    try {

      let resp = await client.openOrders('BSV-USD') 

      console.log(resp)

    } catch(error) {

      console.log(error)

    }

  })

program
  .command('listorders ')
  .action(async () => {

    try {

      let response = await listOrders()

      console.log(response)

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .parse(process.argv)
