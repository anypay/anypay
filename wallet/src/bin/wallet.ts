#!/usr/bin/env ts-node

import yargs from 'yargs'

import { hideBin } from 'yargs/helpers'

import { initWalletFromMnemonic } from '../'

const argv = yargs(hideBin(process.argv))
  .command('pay-invoice <invoice_uid>', 'pay an invoice from your wallet', (args) => {

    args.option('c', {
      alias: 'currency',
      required: true
    })

    args.option('n', {
      alias: 'chain',
      required: true
    })

  }, async (argv) => {

    const chain = argv['n']
    const currency = argv['c']
    const uid = argv['invoice_uid']

    console.log('pay-invoice', { chain, currency, uid })

    try {

      let wallet = await initWalletFromMnemonic()

      console.log(wallet)

      /*let payment = await wallet.payInvoice({
        uid,
        chain,
        currency
      })

      console.log({ payment })
      */

    } catch(error) {

      console.error(error)

    }


  })
  .command('pay-uri <uri>', 'pay an invoice uri from your wallet', (args) => {

    args.option('u', {
      alias: 'uri',
      describe: 'Such as pay?r=https://anypayx.com/r/5kku8UBVM',
      required: true
    })

    args.option('n', {
      alias: 'chain',
      required: true
    })

    args.option('c', {
      alias: 'currency',
      required: true
    })

    args.option('t', {
      alias: 'trasmit'
    })

  }, async (argv) => {

    const chain = argv['n']
    const currency = argv['c']
    const uri = argv['u']
    const transmit = argv['t']

    console.log('pay-uri', { chain, currency, uri })

    try {

      let wallet = await initWalletFromMnemonic()

      console.log(wallet)

      /*
      let payment = await wallet.payUri({
        uri,
        chain,
        currency
      })

      console.log({ payment })
      */

    } catch(error) {

      console.error(error)

    }

  })
  .argv


