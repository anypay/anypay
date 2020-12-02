#!/usr/bin/env ts-node
require('dotenv').config()

import * as program from 'commander'

import * as clover from '../lib/clover'

program
  .command('payorder <orderid> <accesstoken>')
  .action(async (orderid) => {

    let order = await clover.getOrder({ orderid, accesstoken })

    console.log('order', order)

    let resp = await clover.createPayment({ order, accesstoken })

    console.log('payment', resp)

    resp = await clover.updateOrder({ orderid, accesstoken })

    console.log('order', resp);

    process.exit(0)

  })

program
  .command('getorder <orderid>')
  .action(async (orderid) => {

    let resp = await clover.getOrder({ orderid })

    console.log(resp);


    process.exit(0)

  })

program
  .command('addtender [merchantid]')
  .action(async (merchantid='WC9DDB2T6A931') => {

    let resp = await clover.addTender({ merchantid })

    console.log(resp);


    process.exit(0)

  })

program
  .command('listtenders [merchantid]')
  .action(async (merchantid='WC9DDB2T6A931') => {

    let resp = await clover.listTenders({ merchantid })

    console.log(resp);


    process.exit(0)

  })

program
  .parse(process.argv)
