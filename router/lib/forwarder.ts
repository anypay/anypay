import { rpcCall } from './jsonrpc';
import * as _ from 'lodash';
require('dotenv').config();

import * as http from 'superagent';

const models = require('../models');

import { channel } from './events';

import { sendWebhook } from './callbacks';
import { AddressForwardCallback } from './interfaces';
import { publishEvent } from './events';

import { toLegacyAddress } from 'bchaddrjs';

interface BSVPaymentToForward {

  utxo_txid: string;

  utxo_amount: number;

  utxo_vout: number;

  fee: number;

  output_address: string;

}

async function constructForwardPayment(payment: BSVPaymentToForward) {

    let outputs = {}; 

    let params = [
      [{
        txid: payment.utxo_txid,
        vout: payment.utxo_vout
      }],
      outputs
    ];

    outputs[payment.output_address] = parseFloat(
      (payment.utxo_amount - payment.fee).toFixed(6)
    );

    var newRawTx = await rpcCall('createrawtransaction', params);

    return newRawTx;

}

export async function forwardPayment(txid: string, destination?: string): Promise<AddressForwardCallback> {

    /*
     * Lookup address route for BSV payment
     *
     * If route output currency is BSV forward payment
     *
     * If route output currency is not BSV enqueue output
     *
     */

    let fee = 0.00001;

    console.log("getransaction", txid);

    let tx = await rpcCall('gettransaction', [txid]);

    console.log('got transaction', tx);

    let rawTx = await rpcCall('decoderawtransaction', [tx.hex]);

    var forward;

    var forwardAddress;

    for (let i=0; i < rawTx.vout.length; i++) {

      let address = toLegacyAddress(rawTx.vout[i].scriptPubKey.addresses[0]);

      try {

        let resp = await http
          .get(`https://api.anypay.global/address_routes/BSV/${address}`)
          .auth(process.env.BSV_ORACLE_ACCESS_TOKEN, '')

        forward = {
          input_address: resp.body.input.address,
          output_address: resp.body.output.address
        }

        console.log('forward', forward);

      } catch(error) {

        console.log(`error getting route for ${address}`, error.message);

        console.error(error.message);

      }

      if (forward) {

        break;
      }

    }

    if (!forward) {

      return;

    }

    console.log(rawTx.vout);

    let utxo = _.find(rawTx.vout, out => {
   
      return toLegacyAddress(out.scriptPubKey.addresses[0]) === forward.input_address;

    });

    let outputs = {}; 

    var minimum = 0.0001;

    if (utxo.value < minimum) {

      console.log('value less than minimum amount to forward', utxo.value);

      return;
    }

    outputs[forward.output_address] = parseFloat((utxo.value - fee).toFixed(6));

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

    /*
    let existingCallback = await models.AddressForwardCallback.findOne({

      where: {

        destination_transaction_hash: newtx

      }

    });
    */

    let paymentMessage = JSON.stringify({

      address: forward.input_address,

      currency: 'BSV',

      amount: utxo.value,

      hash: txid
    
    });

    await channel.publish('anypay.payments', 'payment',
      new Buffer(paymentMessage)
    );

    console.log('payment message published', paymentMessage);

    var existingCallback;

    if (!existingCallback) {

      let newCallback = {

        value: utxo.value,

        input_address: forward.input_address,

        destination_address: forward.output_address,

        input_transaction_hash: txid,

        destination_transaction_hash: newtx

      };

      console.log('payment.forwarded', newCallback);

      await channel.publish('anypay.forwarder', 'payment.forwarded', new Buffer(
        JSON.stringify(newCallback)
      ));

      console.log('amqp.published.payment.forwarded', JSON.stringify(newCallback));

      let forwardedPayment = await models.AddressForwardCallback.create(
        newCallback
      );

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

