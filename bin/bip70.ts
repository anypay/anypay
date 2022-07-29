#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import * as pay from '../lib/pay'

program
  .command('decodepayment <hex>')
  .action(async (hex) => {

    let payment = pay.BIP70Protocol.Payment.decode(hex);

    console.log(payment)

  })

program
  .command('parsepaymentrequest <invoice_uid> <currency>')
  .action(async (invoice_uid, currency) => {

    let paymentRequest: pay.PaymentRequest = await pay.buildPaymentRequestForInvoice({
      uid: invoice_uid,
      currency,
      protocol: 'BIP70'
    })

    let hex = paymentRequest.content.serialize().toString('hex')

    let decoded = pay.bip70.paymentRequestToJSON(hex, currency)

    console.log(decoded)

    process.exit(0)

  })

program.parse(process.argv)
