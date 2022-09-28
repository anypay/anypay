#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import { Client } from 'payment-protocol'

import { transfer, call, callWalletRpc, send_raw_transaction, verify } from '../'
import { log } from '../../../lib'
import { monero_wallet_rpc } from '../wallet_rpc'
import { json_rpc, other_rpc } from '../json_rpc'

program
  .command('monero_wallet_rpc <method> [params]')
  .action(async (method, params) => {

    try {

      if (params) {
        params = JSON.parse(params)
      }
  
      const response = await monero_wallet_rpc.call<any>(method, params)

      console.log('FIRST', response)

      process.exit(0)

    } catch(error) {

      log.error('xmr.bin.monero_wallet_cli.error', error)

      process.exit(1)
    }


  })

  program
    .command('json_rpc <method> [params]')
    .action(async (method, params) => {

      try {

        if (params) {

          try {

            params = JSON.parse(params)

          } catch(error) {

            log.debug('error', error)

          }
          
        }

        if (method.match(/^\//)) {

          const response = await other_rpc.call<any>(method, params)
  
          console.log(response)


          // "other" rpc method
  
        } else {
  
          // json rpc method

      
          const response = await json_rpc.call<any>(method, params)

          console.log('FIRST', response)

          process.exit(0)

  
        }


      } catch(error) {

        log.error('xmr.bin.monero_wallet_cli.error', error)

        process.exit(1)
      }

    })

program
  .command('payment-request <url>')
  .action(async (url) => {

    let client = new Client(url)

    let paymentRequest = await client.paymentRequest({
      chain: 'XMR',
      currency: 'XMR'
    })

    console.log(JSON.stringify(paymentRequest))

  })

program
  .command('build-payment <url>')
  .action(async (url) => {

    let client = new Client(url)

    let paymentRequest = await client.paymentRequest({
      chain: 'XMR',
      currency: 'XMR'
    })

    let destinations = paymentRequest.instructions[0].outputs

    let tx = await transfer(destinations)

    console.log(JSON.stringify(tx))

  })

program
  .command('pay <url>')
  .action(async (url) => {

    try {

      let client = new Client(url)

      let paymentRequest = await client.paymentRequest({
        chain: 'XMR',
        currency: 'XMR'
      })

      let destinations = paymentRequest.instructions[0].outputs

      let { tx_blob: tx, tx_key, tx_hash } = await transfer(destinations)

      console.log({ tx, tx_key, tx_hash })

      let payment = await client.payment({
        chain: 'XMR',
        currency: 'XMR',
        transactions: [{
          tx, tx_key, tx_hash
        }]
      })

      console.log({ payment })

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('check-tx-key <txid> <tx_key> <address>')
  .action(async (txid, tx_key, address) => {

    let result = await callWalletRpc('check_tx_key', { txid, tx_key, address })

    console.log(result)

  })

program
  .command('verify-payment <url> <txid> <tx_key>')
  .action(async (url, tx_hash, tx_key) => {

    let result = await verify({ url, tx_hash, tx_key })

    console.log(result)

  })

program
  .command('send-raw-transaction <tx_hex> [do_not_relay]')
  .action(async (tx_as_hex, do_not_relay=true) => {

    let result = await send_raw_transaction({ tx_as_hex, do_not_relay })

    console.log(result)

  })

program
  .command('relay-tx <txid>')
  .action(async (txid) => {

    let result = await call('relay_tx', { txids: [txid] })

    console.log(result)

  })

program
  .command('payment <url> <tx_hex> <tx_key>')
  .action(async (url, tx, tx_key) => {

    let client = new Client(url)

    let { payment } = client.payment({
      chain: 'XMR',
      currency: 'XMR',
      transactions: [{
        tx, tx_key
      }]
    })

    console.log({ payment })
    
    process.exit(0)

  })

program.parse(process.argv)

