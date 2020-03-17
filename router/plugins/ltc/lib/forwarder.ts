import { rpcCall } from './jsonrpc';
import * as _ from 'lodash';
require('dotenv').config();

import * as litecoin from 'bitcore-lib-litecoin';

const models = require('../models');

import { sendWebhook } from './callbacks';
import { AddressForwardCallback } from './interfaces';
import { publishEvent, awaitChannel } from './events';

import { lookupOutputFromInput } from '../../../lib/router_client';

export async function forwardPayment(txid: string): Promise<AddressForwardCallback> {

    let fee = 0.0001;

    console.log("getransaction", txid);

    let tx = await rpcCall('gettransaction', [txid]);

    console.log("got transaction", tx);

    let rawTx = await rpcCall('decoderawtransaction', [tx.hex]);

    var route;

    for (let i=0; i < rawTx.vout.length; i++) {

      let address = rawTx.vout[i].scriptPubKey.addresses[0]

      route = await lookupOutputFromInput('LTC', address);

      console.log('ROUTE', route);

      if (route) {

        break;
      }

    }

    try {

      let output = route.output.address;

      console.log('output address', output);

      let address = new litecoin.Address(output);

    } catch(error) {

      console.error("invalid litecoin address", route.output.address);

      return;

    }

    if (!route) {

      console.log('no address route for transaction');

      return;

    } else {

      console.log("route", route);

    }

    let utxo = _.find(rawTx.vout, out => {
      return out.scriptPubKey.addresses[0] === route.input.address;
    });

    let outputs = {}; 

    outputs[route.output.address] = parseFloat((utxo.value - fee).toFixed(6));

    let params = [
      [{
        txid,
        vout: utxo.n
      }],
      outputs
    ];

    try {

      var newRawTx = await rpcCall('createrawtransaction', params);

    } catch(error) {

      console.error('createrawtransaction.error', error.response.body.error.message);

      await publishEvent('error', {
        stage: 'createrawtransaction',
        txid,
        message: error.message,
        response: error.response.body.error.message
      });

      throw error;

    }

    try {

      var signedtx = await rpcCall('signrawtransaction', [newRawTx]);

    } catch(error) {

      console.error('signrawtransaction.error', error.response.body.error.message);

      await publishEvent('error', {
        stage: 'signrawtransaction',
        txid,
        message: error.message,
        response: error.response.body.error.message
      });

      throw error;

    }

    if (!signedtx.complete) {

      throw new Error(signedtx.errors[0].error);

    }

    try {

      var newtx = await rpcCall('sendrawtransaction', [signedtx.hex]);

      let payment = {
        currency: 'LTC',
        address: route.input.address,
        amount: utxo.value / 100000000,
        hash: txid,
        output_hash: newtx
      }

      let channel = await awaitChannel();

      channel.publish('anypay.payments', 'payment', new Buffer(JSON.stringify(payment)));

    } catch(error) {

      console.error('sendrawtransaction.error', error.response.body.error.message);

      await publishEvent('error', {
        stage: 'sendrawtransaction',
        txid,
        message: error.message,
        response: error.response.body.error.message
      });

      throw error;

    }

}

