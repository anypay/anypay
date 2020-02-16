#!/usr/bin/env ts-node

import * as program from 'commander';
import { createAddressForward, forwardUnspent } from '../lib';
import { HDPrivateKey, PrivateKey } from 'bitcore-lib-cash';
import { rpcCall } from '../lib/jsonrpc';
import * as http from 'superagent';
import * as _ from 'lodash';
const models = require('../models');
require('dotenv').config();

import { forwardPayment } from '../lib/forwarder';

program
  .command('generateinvoice')
  .action(async () => {

    let resp = await http
      .post('https://api.anypay.global/invoices')
      .auth('1fc38af9-11b9-462f-a6bc-85d7f3e2ee46', '')
      .send({
        currency: 'LTC',
        amount: 0.1
      });

    console.log(resp.body);

  });


program
  .command('forwardunspent')
  .action(async () => {

    await forwardUnspent();

    process.exit(0);

  });

program
  .command('manuallyprocesspayment <hash>')
  .action(async (hash) => {

    await http.post(`https://ltc.anypay.global/v1/ltc/transactions/${hash}`);

  });

program
  .command('getaddresspayments <address>')
  .action(async (address) => {
  });

program
  .command('createaddressforward <destination> [callback_url]')
  .action(async (destination, callback_url) => {

    try {

      let forward = await createAddressForward({
        destination,
        callback_url
      });

      console.log(forward.toJSON());

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('gettransaction <txid>')
  .action(async (txid) => {

    let resp = await rpcCall('gettransaction', [txid]);

    console.log(resp);

  })

program
  .command('forwardpayment <txid>')
  .action(async (txid) => {

    try {

      let callback = await forwardPayment(txid);

      console.log(callback);

    } catch(error) {

      console.error(error.message);

    }

  });

program
  .command('newhdprivatekey')
  .action(async () => {

    let key = new HDPrivateKey();

    console.log(key.toString());

  });

program
  .command('getnewaddress [nonce]')
  .action(async (nonce) => {

    let privateKey = new HDPrivateKey(process.env.HD_LTC_PRIVATE_KEY);

    let pubkey = privateKey.derive("m/0'");

    console.log(pubkey);

  });

program
  .command('rpcgetnewaddress')
  .action(async (nonce) => {

    let resp = await rpcCall('getnewaddress');

    console.log(resp);

  });

program
  .command('rpclistunspent')
  .action(async (nonce) => {

    let resp = await rpcCall('listunspent',[0]);

    console.log(resp);

  });



program.parse(process.argv);

