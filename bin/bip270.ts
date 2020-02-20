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
    //.get(`https://api.anypayinc.com/r/${invoiceUID}`)
      .get(`http://localhost:8000/r/${invoiceUID}`)
      .set({
        'accept': 'application/bitcoin-sv-payment-request'
      })

    console.log(response.body);

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

program.parse(process.argv);

