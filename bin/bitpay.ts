#!/usr/bin/env ts-node

require('dotenv').config();

import * as program from 'commander';

import * as http from 'superagent';

import { channel, awaitChannel, wait } from '../lib/amqp';
import { models } from '../lib';
import * as bitpay from '../lib/bitpay';

const BASE_URL = 'http://127.0.0.1:8100';
const TOKEN = process.env.SUDO_PASSWORD;

program
  .command('invoice <amount>')
  .action(async (amount) => {

    try {
      let resp = await bitpay.create(amount);

      console.log(resp);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('createsettlement <invoiceUID>')
  .action(async (uid) => {

    try {

      let resp = await http.post(`${BASE_URL}/api/bitpay_settlements`)
        .auth(TOKEN, '')
        .send({
          invoice_uid: uid
        });
        
      console.log(resp.body);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });

program
  .command('recordsettlement <invoice_uid> <txid> [amount] [currency]')
  .action(async (uid, txid, amount, currency) => {

    try {

      let resp = await http.put(`${BASE_URL}/api/bitpay_settlements/${uid}`)
        .auth(TOKEN, '')
        .send({
          txid,
          amount,
          currency
        });
        
      console.log(resp.body);

    } catch(error) {

      console.log(error);

    }

    process.exit(0);

  });


program.parse(process.argv);

