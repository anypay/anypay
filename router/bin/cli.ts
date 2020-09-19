#!/usr/bin/env ts-node

import * as program from 'commander';
import { createAddressForward, forwardUnspent, sweepDust } from '../lib';
import { HDPrivateKey, PrivateKey } from 'bitcore-lib-cash';
import { rpcCall } from '../lib/jsonrpc';
import * as http from 'superagent';
import * as _ from 'lodash';
const models = require('../models');
require('dotenv').config();

import { Op } from 'sequelize';

import { BigNumber } from 'bignumber.js';

import { forwardPayment } from '../lib/forwarder';

program
  .command('generateinvoice')
  .action(async () => {

    let resp = await http
      .post('https://api.anypayinc.com/invoices')
      .auth('1fc38af9-11b9-462f-a6bc-85d7f3e2ee46', '')
      .send({
        currency: 'BCH',
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

    await http.post(`https://bch.anypayinc.com/v1/bch/transactions/${hash}`);

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

    let privateKey = new HDPrivateKey(process.env.HD_BCH_PRIVATE_KEY);

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
  .command('sweepdust [address]')
  .action(async (address) => {

    await sweepDust();

  });

program
  .command('listunspent [address]')
  .action(async (address) => {

    let unspent = await rpcCall('listunspent', [0]);

    let spendable = unspent.filter(utxo => utxo.spendable);
    let notSpendable = unspent.filter(utxo => !utxo.spendable);

    spendable = spendable.filter(utxo => utxo.amount >= 0.0001); 

    console.log(`${spendable.length} spendable utxos`);

    spendable.forEach(console.log);

    let address_forwards = await models.AddressForward.findAll({
      where: {
        input_address: {
          [Op.in]: spendable.map(s => s.address)
        }
      }
    });

    console.log(`${address_forwards.length} address forwards found`);

    for (let i=0; i < spendable.length; i++) {
      let utxo = spendable[i];
      try {

      let resp = await forwardPayment(spendable[i].txid);
      console.log(resp);
      } catch(error) {
        console.error(error.message);
      }
    }

  });

program
  .command('sweepunspent [address]')
  .action(async (address) => {

    let price = new BigNumber(150);

    let fee = (new BigNumber(0.1)).dividedBy(price);

    console.log('ten cents', fee);

    let unspent = await rpcCall('listunspent', [0]);

    let change = 'bitcoincash:qz7lh923zdpw6mwtrwsh5kz6y73avghxagup3qlpw5';

    console.log('unspent', unspent);

    let dustInputs = _.filter(unspent, utxo => {

      return utxo.confirmations < 100 && utxo.address !== change;

    }).map(utxo => {

      return {

        "txid": utxo.txid,

        "vout": utxo.vout,

        "amount": new BigNumber(utxo.amount)

      }

    });

    console.log('dust inputs', dustInputs);

    let changeInput = _.filter(unspent, utxo => {

      return utxo.address === change;

    })[0];

    console.log("change input", changeInput);

    let totalDust = dustInputs.reduce((sum, input) => {

      return sum.plus(input.amount);
    
    }, new BigNumber(0));

    console.log('total dust', totalDust.toNumber());

    let changeInputAmount = new BigNumber(changeInput.amount);

    let changeAmount = changeInputAmount.plus(totalDust).minus(fee);

    console.log("change amount", changeAmount.toPrecision(8));

    let outputs = {};

    outputs[change] = parseFloat(changeAmount.toPrecision(8));

    let inputs = dustInputs.map(i => {
      return {
        "txid": i.txid,
        "vout": i.vout
      }
    });

    inputs.push({
      "txid": changeInput.txid,
      "vout": changeInput.vout
    });

    let rawtx = await rpcCall('createrawtransaction', [

      inputs,

      outputs

    ]);

    console.log("rawtx", rawtx);

    let signed = await rpcCall('signrawtransaction', [rawtx]);

    console.log("signedrawtx", signed);

    let res = await rpcCall('sendrawtransaction', [signed.hex]);

    console.log('res', res);

  });

program
  .command('reconcile')
  .action(async () => {

    let noForward = [];
    let yesForward = [];

    let resp = await rpcCall('listunspent', [0]);

    console.log(resp);
    console.log(`${resp.length} payments in wallet`);

    let utxos = resp;

    for (let i=0; i< utxos.length; i++) {

      let utxo = utxos[i];

      console.log(utxo);

      let forward = await models.AddressForward.findOne({ where: {

        input_address: utxo.address

      }});

      if (forward) {

        yesForward.push(utxo);

      } else {

        noForward.push(utxo);

      }


    }

    console.log(`${yesForward.length}.length payments to forward`);
    console.log(`${noForward.length}.length payments to not forward`);

  });

program
  .command('sweepdust')
  .action(async () => {

    let resp = await sweepDust();

    console.log(resp);

  });
 
  

program.parse(process.argv);

