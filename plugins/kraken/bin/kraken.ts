#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { KrakenAccount, listAll, fromAccount } from '../lib/kraken_account'

import { Account } from '../../../lib/account'

program
  .command('listaccounts')
  .action(async () => {

    try {

      let accounts = await listAll()

      for (let account of accounts) {

        console.log(account.toJSON())

      }

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('addresses <id> <asset>')
  .action(async (id, asset) => {

    try {

      let account = await Account.findOne({ id })

      let kraken = await fromAccount(account)

      let result = await kraken.api('DepositMethods', { asset })

      console.log(result)


    } catch(error) {

      console.error(error)

    }

  })

program
  .command('balances <id>')
  .action(async (id) => {

    try {

      let account = await Account.findOne({ id })

      let kraken = await fromAccount(account)

      let balances = await kraken.api('Balance')

      console.log(balances)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('balancesbreakdown <id>')
  .action(async (id) => {

    try {

      let account = await Account.findOne({ id })

      let krakenAccount = await fromAccount(account)

      let balances = await krakenAccount.listBalances()

      console.log(balances)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('deposits <id>')
  .action(async (id) => {

    try {

      let account = await Account.findOne({ id })

      let kraken = await fromAccount(account)

      let deposits = await kraken.api('DepositStatus', {
        asset: 'BTC'
      })

      console.log(deposits)

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('sellall <id>')
  .action(async (id) => {

    try {

      let account = await Account.findOne({ id })

      let kraken = await fromAccount(account)

      let result = await kraken.sellAll()

      console.log(result)

    } catch(error) {

      console.error(error)

    }

  })


program
  .command('assetpairs')
  .action(async () => {

    try {

      let account = await Account.findOne({ id: 1177 })

      let kraken = await fromAccount(account)

      let result = await kraken.api('AssetPairs')

      console.log(result)

    } catch(error) {

      console.error(error)

    }

  })

program.parse(process.argv)

