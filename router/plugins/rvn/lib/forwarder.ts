import { rpcCall } from './jsonrpc';
import * as _ from 'lodash';
require('dotenv').config();

const models = require('../models');

import { sendWebhook } from './callbacks';
import { AddressForwardCallback } from './interfaces';
import { publishEvent } from './events';

export async function forwardPayment(txid: string): Promise<AddressForwardCallback> {

    let fee = 0.00001;

    console.log("getransaction", txid);

    let tx = await rpcCall('gettransaction', [txid]);

    console.log("got transaction", tx);

    let rawTx = await rpcCall('decoderawtransaction', [tx.hex]);

    var forward;

    for (let i=0; i < rawTx.vout.length; i++) {

      forward = await models.AddressForward.findOne({ where: {

        input_address: rawTx.vout[i].scriptPubKey.addresses[0]

      }});

      if (forward) {

        break;
      }

    }

    if (!forward) {

      console.log('no address forward for transaction');

      return;

    } else {

      console.log("forward", forward.toJSON());

    }

    let utxo = _.find(rawTx.vout, out => {
      return out.scriptPubKey.addresses[0] === forward.input_address;
    });

    let outputs = {}; 

    var minimum = 0.0001;

    if (utxo.value < minimum) {

      console.log('value less than minimum amount to forward', utxo.value);

      return;
    }

    outputs[forward.destination] = parseFloat((utxo.value - fee).toFixed(6));

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

    let existingCallback = await models.AddressForwardCallback.findOne({

      where: {

        destination_transaction_hash: newtx

      }

    });

    if (!existingCallback) {

      let forwardedPayment = await models.AddressForwardCallback.create({

        value: utxo.value,

        input_address: forward.input_address,

        destination_address: forward.destination,

        input_transaction_hash: txid,

        destination_transaction_hash: newtx

      });

      let callback = forwardedPayment.toJSON();

      if (forward.callback_url) {

        let resp = await sendWebhook(forward.callback_url, callback);

        console.log('webhook.sent', resp.body);

      }

      return callback;

    } else {

      console.log('payment already forwarded');

    }

}

