#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import { models } from '../lib/models'

import { getMiningFee } from '../lib/fees'

program 
  .command('miningfee <invoice_uid>')
  .action(async (invoice_uid) => {

    let payment = await models.Payment.findOne({ where: { invoice_uid }})

    if (!payment) throw new Error('payment for invoice not found')

    let feeResult = await getMiningFee(payment.currency, payment.txhex)

    console.log(Object.assign({ txid: payment.txid }, feeResult))

  })

program.parse(process.argv)

