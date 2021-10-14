#!/usr/bin/env ts-node
require('dotenv').config()

import * as program from 'commander';
import * as http from 'superagent';
import * as bitcoin from 'bsv';
import * as datapay from 'datapay';
import * as PaymentProtocol from '../vendor/bitcore-payment-protocol';

import { rawTxToPayment } from '../plugins/bch/lib/rawtx_to_payment';
import { awaitChannel } from '../lib/amqp';
const axios = require('axios');

program
  .command('publishbch <uid> <hex>')
  .action(async (uid, hex) => {
    let payments = rawTxToPayment(hex)  

    console.log('payments', payments);

    let channel = await awaitChannel();

    payments.forEach(payment => {

      channel.publish('anypay.payments', 'payment', Buffer.from(

        JSON.stringify(Object.assign(payment, {invoice_uid: uid })) 


      ))

    });

  })

program
  .command('payinvoice <invoice_uid>')
  .action(async (invoiceUID) => {


    let response = await http
      .get(`https://api.anypayinc.com/r/${invoiceUID}`)
      .set({
        'accept': 'application/bitcoinsv-paymentrequest'
      })

    console.log(response);

    let outputs = response.body.outputs.map(output => {

      console.log('output', output);

      let script = new bitcoin.Script(output.script);

      let address = new bitcoin.Address(script.getPublicKeyHash()).toString();

      let value = output.amount;

      return {
        address,
        value
      }

    });

    var config = {
      pay: {
        key: process.env.BIP_270_EXTRA_OUTPUT_WIF,
        to: outputs
      }
    }
    datapay.send(config, console.log);

  });

program.option('-D, --dev', 'use local development API server');

program
  .command('getpaymentrequest <invoice_uid> <currency>')
  .action(async (invoiceUID, currency) => {

    var accept, response, details, data;

    switch(currency) {
    case 'BSV':
      accept = 'application/bitcoinsv-paymentrequest'

      response = await http
        .get(`https://api.anypayinc.com/r/${invoiceUID}`)
    //    .get(`http://localhost:8000/r/${invoiceUID}`)
        .set({
          'accept': accept
        });

      console.log(response.body);
      break;
    case 'DASH':
      accept = 'application/dash-paymentrequest'

      response = await axios.get(`https://api.anypayinc.com/r/${invoiceUID}`, {
        responseType: 'arraybuffer',
        headers: {
          'accept': accept
        }
      })

      console.log(response.data);

      data = PaymentProtocol.PaymentRequest.decode(response.data);

      console.log(data.serialized_payment_details);

      details = PaymentProtocol.PaymentDetails.decode(data.serialized_payment_details);

      console.log(details);
      console.log(details.merchant_data.toString());

      //console.log(PaymentProtocol.MerchantData.decode(details.merchant_data));

      break;

    case 'BCH':
      accept = 'application/bitcoincash-paymentrequest'

      var host = !!program.dev ? 'http://localhost:8000' : 'https://api.anypayinc.com';
      console.log(`USING API ${host}`);

      response = await axios.get(`${host}/r/${invoiceUID}`, {
        responseType: 'arraybuffer',
        headers: {
          'accept': accept
        }
      })

      console.log(response.data);

      data = PaymentProtocol.PaymentRequest.decode(response.data);

      console.log(data.serialized_payment_details);

      details = PaymentProtocol.PaymentDetails.decode(data.serialized_payment_details);

      console.log(details);
      console.log(details.merchant_data.toString());

      //console.log(PaymentProtocol.MerchantData.decode(details.merchant_data));

      break;
    }

  });


program.parse(process.argv);

