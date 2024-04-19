#!/usr/bin/env ts-node
/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================
require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { join } from 'path'
import * as fs from 'fs'

import * as http from 'superagent'

import { BIP70Protocol, buildOutputs, buildPaymentRequest, completePayment, fees, PaymentOption } from '../../lib/pay';
import prisma from '../../lib/prisma';

import { payment_options as PrismaPaymentOption } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library';

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

    } catch(error: any) {

      console.error(error.message)
      

    }

    process.exit(0)

  });

program
  .command('completepayment <invoice_uid> <currency> <txhex>')
  .action(async (invoice_uid, currency, hex) => {

    try {

      let paymentOption = await prisma.payment_options.findFirstOrThrow({
        where: {
          invoice_uid,
          currency
        }
      })

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
  .command('submitexample <currency> [isvalid]')
  .action(async (currency, isValid=true) => {

    /*
    let payment = getPayment(currency, isValid)

    try {

      let response = await submitPayment({
        invoice_uid: payment.invoice_uid,
        currency,
        transactions: [payment.transaction]
      });

    } catch(error) {
      console.log(error);
    }

    process.exit(0);
    */

  })


program
  .command('submitpayment <invoice_uid> <currency> <hex>')
  .action(async (invoice_uid, currency, transaction) => {

/*
    try {

      let response = await submitPayment({
        invoice_uid,
        currency,
        transactions: [transaction]
      });

    } catch(error) {

      console.error(error);

    }

    process.exit(0)
    */

  });

program
  .command('buildoutputs <invoice_uid> <currency> <protocol>')
  .action(async (invoice_uid, currency, protocol) => {

    try {

      const payment_option = await prisma.payment_options.findFirstOrThrow({
        where: {
          currency,
          invoice_uid
        }

      })

      if (!payment_option.outputs) {
        throw new Error('No outputs found for payment option')
      }

      const buildOutputsOption: PaymentOption = {
        invoice_uid,
        chain: currency,
        currency,
        address: payment_option.address,
        outputs: (payment_option.outputs as any[]).map((output: PrismaPaymentOption) => {
          return {
            amount: (output.amount as Decimal).toNumber(),
            address: String(output.address)
          }
        })
      }

      let outputs = await buildOutputs(buildOutputsOption, protocol);

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
      const paymentOption = await prisma.payment_options.findFirstOrThrow({
        where: {
          currency,
          invoice_uid
        }
      })

      const invoice = await prisma.invoices.findFirstOrThrow({
        where: {
          uid: invoice_uid
        }
      })

      const buildOutputsOption: PaymentOption = {
        invoice_uid,
        chain: currency,
        currency,
        address: paymentOption.address,
        outputs: (paymentOption.outputs as any[]).map((output: PrismaPaymentOption) => {
          return {
            amount: (output.amount as Decimal).toNumber(),
            address: String(output.address)
          }
        })
      }

      let paymentRequest = await buildPaymentRequest({
        paymentOption: buildOutputsOption,
        invoice
      })

      console.log(paymentRequest);

    } catch(error) {

      console.error(error);

    }

    process.exit();
  
  });

program.parse(process.argv);


