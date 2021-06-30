#!/usr/bin/env ts-node

require("dotenv").config()

import * as program from 'commander'

const { BittrexClient } = require('bittrex-node')

import { models } from '../lib/models'

let client = new BittrexClient({
  apiKey: process.env.MCD_BITTREX_API_KEY,
  apiSecret: process.env.MCD_BITTREX_API_SECRET
})

import { marketOrder, listOrders, listAddresses, createAddress } from '../lib/bittrex'

import * as bittrex from '../lib/bittrex'

program
  .command('listaddresses <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let addresses = await listAddresses(account.id)

      console.log(addresses)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('createaddress <email> <currency>')
  .action(async (email, currency) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let address = await createAddress(account.id, currency)

      console.log(address)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('setaccountaddresses <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      await bittrex.setAccountAddresses(account.id)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('setapikeys <email> <key> <secret>')
  .action(async (email, api_key, api_secret) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      if (!account){ 
        throw new Error(`account ${email} not found`)
      }

      let [bittrexAccount, isNew] = await models.BittrexAccount.findOrCreate({
        where: {
          account_id: account.id
        },
        defaults: {
          api_key,
          api_secret,
          account_id: account.id
        }
      })

      bittrexAccount.api_key = api_key
      bittrexAccount.api_secret = api_secret

      await bittrexAccount.save()

      console.log(bittrexAccount.toJSON())

    } catch(error) {

      console.log(error)

    }
    
  })



program
  .command('listordersv1')
  .action(async () => {

    try {

      let resp = await client.openOrders('BSVUSD') 

      console.log(resp)

    } catch(error) {

      console.log(error)

    }

  })

program
  .command('listorders <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let response = await listOrders(account.id)

      console.log(response)

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .command('getbalances <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let response = await bittrex.listBalances(account.id)

      console.log(response)

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .command('listopendeposits <email>')
  .action(async (email) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let response = await bittrex.listOpenDeposits(account.id)

      console.log(response)

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .command('sellall <email> <currency>')
  .action(async (email, currency) => {

    try {

      let account = await models.Account.findOne({ where: { email }})

      let balance = await bittrex.getBalance(account.id, currency)

      console.log(`balance: ${balance}`)

      if (balance > 0) {

        let order = await bittrex.marketOrder(account.id, currency, balance)

        console.log(order)

      }

    } catch(error) {

      console.log(error)

    }
    
  })

program
  .parse(process.argv)
