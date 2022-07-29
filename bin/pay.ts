#!/usr/bin/env ts-node

require('dotenv').config()

import * as program from 'commander'

import { models } from '../lib/models'

import { join } from 'path'
import * as fs from 'fs'

import * as http from 'superagent'

import { BIP70Protocol, buildOutputs, buildPaymentRequest, completePayment, fees } from '../lib/pay';

program
  .command('decode_bip70_request <path>')
  .action(async (path) => {

    let file = fs.readFileSync(join(process.cwd(), path))

    let request = BIP70Protocol.PaymentRequest.decode(file)

    console.log(request)

  })

program
  .command('tests <base_url>')
  .action( async (base_url) => {

    try {

      let uid = 'f6eF_inmN'

      let resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'BCH'
        })

      console.log(resp)

      resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'DASH'
        })

      console.log(resp.body)

      resp = await http
        .get(`${base_url}/r/${uid}`) 
        .set({
          'Accept': 'application/payment-request',
          'x-currency': 'BTC'
        })

      console.log(resp.body)

      resp = await http
        .get(`${base_url}/r/${uid}`) 

      console.log(resp.body)

    } catch(error) {

      console.error(error.message)
      

    }

    process.exit(0)

  });

program
  .command('completepayment <invoice_uid> <currency> <txhex>')
  .action(async (invoice_uid, currency, hex) => {

    try {

      let paymentOption = await models.PaymentOption.findOne({ where: { invoice_uid, currency }})

      let payment = await completePayment(paymentOption, hex)

      console.log('payment', payment);

    } catch(error) {

      console.error(error);

    }

    process.exit(0)

  })

program
  .command('getfee <currency>')
  .action(async (currency) => {

    let fee = await fees.getFee(currency);

    console.log(fee);

    process.exit();

  });

program
  .command('buildoutputs <invoice_uid> <currency> <protocol>')
  .action(async (invoice_uid, currency, protocol) => {

    try {

      let payment_option = await models.PaymentOption.findOne({ where: { currency, invoice_uid }});

      let outputs = await buildOutputs(payment_option, protocol);

      console.log(outputs);

    } catch(error) {

      console.error(error);

    }

    process.exit();
  
  });

program
  .command('buildpaymentrequest <invoice_uid> <currency> <protocol>')
  .action(async (invoice_uid, currency, protocol) => {

    try {

      let paymentOption = await models.PaymentOption.findOne({ where: { currency, invoice_uid }});

      let paymentRequest = await buildPaymentRequest(Object.assign(paymentOption, { protocol }));

      console.log(paymentRequest);

    } catch(error) {

      console.error(error);

    }

    process.exit();
  
  });

program.parse(process.argv);

