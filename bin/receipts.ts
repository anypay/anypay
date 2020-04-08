#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import { receipts } from '../lib';

import * as datapay from 'datapay';
import * as filepay from 'filepay';

program
  .command('send')
  .action(async () => {

    const tx = {
      safe: true,
      data: ["0x6d02", "hello world"],
      pay: {
        key: process.env.ENERGY_CITY_BITCOM_PRIVKEY,
      }
    };

    filepay.build(tx, function(err, res) {

      console.log(res);
      console.log(res.toString());
      /**
      * res contains the generated transaction object
      * (a signed transaction, since 'key' is included.
      * Also, the transaction includes actual coin transfer outputs,
      * since the "to" attribute is included)
      **/

      filepay.send(tx, function(err, txid) {
        console.log('err', err);
        console.log('txid', txid);

        process.exit(0);
      });
    })

  });

program
  .command('balance <address>')
  .action(async (address) => {

    datapay.connect('https://api.mattercloud.net').getUnspentUtxos(address, function(err, utxos) {
      if (err) {
        console.log("Error: ", err)
      } else {
        console.log(utxos)
      }
    });

  });

program
  .command('publish <receipt_id>')
  .action(async (id) => {

    try {
      let resp = await receipts.publishReceipt(id)

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program.parse(process.argv);

