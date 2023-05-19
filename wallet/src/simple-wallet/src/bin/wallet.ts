#!/usr/bin/env ts-node

import { program } from 'commander'

import { loadWallet } from '../wallet'

import * as btc from 'bitcore-lib'

import { Client } from '/Users/zyler/github/anypay/payment-protocol'

program
  .command('balances')
  .action(async () => {

    try {

      let wallet = await loadWallet()

      let balances = await wallet.balances()

      console.log({ balances })

    } catch (error) {

      console.error(error)

    }

  })

program
  .command('balance <asset>')
  .action(async (asset) => {

    try {

      let wallets = await loadWallet()

      let wallet = wallets.asset(asset)

      let balance = await wallet.balance()

      console.log({ balance })

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('payuri <uri> <asset>')
  .action(async (invoice_uid, asset) => {

    try {

      let wallet = await loadWallet()

      let payment = await wallet.payUri(invoice_uid, asset, { transmit: true })

      console.log({ payment })

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('pay <invoice_uid> <asset>')
  .action(async (invoice_uid, asset) => {

    try {

      let wallet = await loadWallet()

      let payment = await wallet.payInvoice(invoice_uid, asset)

      console.log({ payment })

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('buildpayment <invoice_uid> <asset>')
  .action(async (invoice_uid, asset) => {

    try {

      let wallet = await loadWallet()

      let payment = await wallet.payInvoice(invoice_uid, asset, { transmit: false })
      console.log({ payment })

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('receive <value> <currency>')
  .action(async (value, currency) => {

    try {

      let wallet = await loadWallet()

      /*let invoice = await wallet.receive({
        currency, value
      })

      console.log({ invoice })
      */

    } catch(error) {

      console.error(error)

    }

  })

program
  .command('paymentrequest <uri> <currency>')
  .action(async (uri, currency) => {

    let client: any = new Client(uri)

    try {
      
      let { paymentOptions } = await client.getPaymentOptions()

      let paymentRequest = await client.selectPaymentOption({
        chain: currency,
        currency: currency
      })

      console.log(JSON.stringify(paymentRequest))

    } catch(error) {

      console.error(error)

    }

  })

program.parse(process.argv)
