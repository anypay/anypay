#!/usr/bin/env ts-node

require("dotenv").config()

import * as program from 'commander'

import { BTCTraverser } from '../lib/btc_traverser'

program
  .command('traverse <txid> [n]')
  .action(async (txid, n=12) => {

    try {

      let traverser = new BTCTraverser(txid)

      await traverser.getParents(txid)

    } catch(error) {

      console.error('error', error)

    }

    process.exit(0)
  })

program
  .command('gettx <txid>')
  .action(async (txid) => {

    try {

      let response: any = await rpc.call('getrawtransaction', [txid])

      let rawtx = response.result

      console.log(rawtx)

      response = await rpc.call('decoderawtransaction', [rawtx])

      console.log(response.result)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })


program
  .command('getrawtx <txid>')
  .action(async (txid) => {

    try {

      let result = await rpc.call('getrawtransaction', [txid])

      console.log(result)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program
  .parse(process.argv)


