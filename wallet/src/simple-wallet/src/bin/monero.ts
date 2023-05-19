#!/usr/bin/env ts-node

require("dotenv").config()

import { program } from 'commander'

import * as xmr from '../assets/xmr'

import { Client } from '../client'

import { PaymentRequest, BuiltPayment } from '../assets/xmr'

const walletRPCs = [
  "67.223.119.94",
  "67.223.119.106",
  "162.255.116.76"
]

program
  .command('pay_invoice <invoice_uid>')
  .action(async (invoice_uid) => {

    try {

      const client = new Client(`https://api.anypayx.com/i/${invoice_uid}`)

      const paymentRequest = await client.selectPaymentOption({ currency: 'XMR', chain: 'XMR' })

      const payment = await xmr.buildPayment(paymentRequest)

      if (!paymentRequest) {

        throw new Error('XMR is not a payment option')

      }

      // get payment request details
      //
      //
      // build payment
      //
      // send payment to anypay
      //

      const { tx_blob, tx_key, tx_hash } = payment

      let transmitPaymentResult = await client.transmitPayment(paymentRequest, tx_blob, {
        tx_hash, tx_key
      })

      process.exit(0)
 
    } catch(error) {

      console.error(error)

      process.exit(1)

    }

  })

program
  .command('submit_transfer <tx_as_hex>')
  .action(async (tx_as_hex) => {

    try {

      let results = await Promise.all(walletRPCs.map(async node => {

        try {

          let rpc = new xmr.rpc.RpcClient({
            url: `http://67.223.119.94:18081/send_raw_transaction`
          })

          let result = await rpc.sendRawTransaction({tx_as_hex})

          console.log(result)

          return result

        } catch(error) {

          console.error(error)

        }

      }))

      process.exit(0)

     } catch(error) {

       console.error(error)

       process.exit(1)

     }

  })



program
  .command('balance')
  .action(async () => {

    try {

      let results = await Promise.all(walletRPCs.map(async node => {

        try {

          let rpc = new xmr.rpc.RpcClient({
            url: `http://${node}:28088/json_rpc`
          })

          let result = await rpc.getBalance(process.env.XMR_SIMPLE_WALLET_ADDRESS)

          console.log(JSON.stringify({ node, result }, null, 4))

        } catch(error) {

          console.log(JSON.stringify({ node, error: error.message }, null, 4))

        }


      }))

      process.exit(0)

    } catch(error) {

      console.error(error)

      process.exit(1)

    }

  })


program
  .command('build_payment <address> <amount>')
  .action(async (address, amount) => {

    amount = parseFloat(amount)

    const paymentRequest: PaymentRequest = {

      paymentUrl: "http://api.anypayx.com/api/v1/transactions",

      instructions: [{

        outputs: [{

          address,

          amount
        }]

      }]

    }

    let builtPayment: BuiltPayment = await xmr.buildPayment(paymentRequest)

    try {

      let results = await Promise.all(walletRPCs.map(async node => {

        try {

          let rpc = new xmr.rpc.RpcClient({
            url: `http://${node}:28088/json_rpc`
          })

          let result = await rpc.getBalance(process.env.XMR_SIMPLE_WALLET_ADDRESS)

          console.log(JSON.stringify({ node, result }, null, 4))

        } catch(error) {

          console.log(JSON.stringify({ node, error: error.message }, null, 4))

        }


      }))

      process.exit(0)

    } catch(error) {

      console.error(error)

      process.exit(1)

    }

  })
program
  .command('block_height')
  .action(async () => {

    try {

      let results = await Promise.all(walletRPCs.map(async node => {

        try {

          let rpc = new xmr.rpc.RpcClient({
            url: `http://${node}:28088/json_rpc`
          })

          let result = await rpc.getBalance(process.env.XMR_SIMPLE_WALLET_ADDRESS)

          console.log(JSON.stringify({ node, result }, null, 4))

        } catch(error) {

          console.log(JSON.stringify({ node, error: error.message }, null, 4))

        }


      }))

      process.exit(0)

    } catch(error) {

      console.error(error)

      process.exit(1)

    }

  })

program
  .parse(process.argv)
