#!/usr/bin/env ts-node
require('dotenv').config()

import * as program from 'commander';
import * as http from 'superagent';
import * as bitcoin from 'bsv';
import * as datapay from 'datapay';

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

    var accept;

    switch(currency) {
    case 'BSV':
      accept = 'application/bitcoinsv-paymentrequest'
      break;
    case 'DASH':
      accept = 'application/dash-paymentrequest'
      break;
    }

    let response = await http
      .get(`https://api.anypayinc.com/r/${invoiceUID}`)
      .set({
        'accept': accept
      });

    console.log(response);

  });


program.parse(process.argv);

