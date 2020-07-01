#!/usr/bin/env ts-node
require('dotenv').config()

import * as program from 'commander';
import * as http from 'superagent';
import * as bitcoin from 'bsv';
import * as datapay from 'datapay';
import * as PaymentProtocol from '../vendor/bitcore-payment-protocol';
const axios = require('axios');

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

program
  .command('getpaymentrequest <invoice_uid> <currency>')
  .action(async (invoiceUID, currency) => {

    var accept, response;

    switch(currency) {
    case 'BSV':
      accept = 'application/bitcoinsv-paymentrequest'

      response = await http
    //    .get(`https://api.anypayinc.com/r/${invoiceUID}`)
        .get(`http://localhost:8000/r/${invoiceUID}`)
        .set({
          'accept': accept
        });

      console.log(response);
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

      var data = PaymentProtocol.PaymentRequest.decode(response.data);

      console.log(data.serialized_payment_details);

      let details = PaymentProtocol.PaymentDetails.decode(data.serialized_payment_details);

      console.log(details);
      console.log(details.merchant_data.toString());

      //console.log(PaymentProtocol.MerchantData.decode(details.merchant_data));

      break;
    }


  });


program.parse(process.argv);

