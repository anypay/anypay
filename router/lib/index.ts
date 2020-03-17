require('dotenv').config();

import { log } from './logger';

import { Address, PrivateKey } from 'bitcore-lib-cash';
import { isURL } from 'validator';
import { rpcCall } from './jsonrpc';

import { forwardPayment } from './forwarder';

import * as http from 'superagent';

import { channel, exchange, awaitChannel } from './events';

import { AddressForwardOptions } from './interfaces';

import * as _ from 'lodash';
import * as underscore from 'underscore';

import { BigNumber } from 'bignumber.js'

const models = require('../models');

export async function forwardUnspent() {

  let resp = await rpcCall('listunspent', [0]);

  for (let i=0; i < resp.length; i++) {

    try {

      await forwardPayment(resp[i].txid);

    } catch(error) {

      console.error(error.message);

    }

  }

}

export async function getMemPoolTxs(){

  let resp = await http.post(`${process.env.BSV_RPC_HOST}:${process.env.BSV_RPC_PORT}`)
			.auth(process.env.BSV_RPC_USER, process.env.BSV_RPC_PASSWORD)
			.send({
				method:'getrawmempool',
				params:[]
			});

 return resp.body.result;

}

export async function getNewAddress(): Promise<string> {

  let address = await rpcCall('getnewaddress');

  return address;
}

function wait(ms) {

  return new Promise(resolve => {

    setTimeout(resolve, ms);

  });

}

export async function pollAddressForPayments(address) {

  let interval = 10000; // ten seconds

  let total = 60; // ten minutes

  for (let i=0; i<total; i++) {

    let payments = await publishTxnsForAddress(address);

    if (payments.length > 0) {

      break;

    }

    await wait(interval);

  }

}

export async function publishTxnsForAddress(address) {

  let resp = await http.get(`https://rest.bitcoin.com/v1/address/details/${address}`)

  await awaitChannel();

  let routingKey = 'transaction.created';

  let txns = resp.body.transactions;

  for (let i=0; i<txns.length; i++) {

    let tx = txns[i];

    console.log(tx);

    await channel.publish(exchange, routingKey, new Buffer(tx));

  }

  return txns;

}

export async function createAddressForward(options: AddressForwardOptions) {

  if (!Address.isValid(options.destination)) {

    throw new Error(`invalid bitcoin cash address ${options.destination}`);

  }

  if (options.callback_url && !isURL(options.callback_url)) {

    throw new Error(`invalid callback url ${options.callback_url}`);

  }

  log.info('createaddressforward', options);

  let input_address = await getNewAddress();

  let record = await models.AddressForward.create(Object.assign(options, {
    input_address 
  }));

  return record;

}

export async function sweepDust() {

  let price = new BigNumber(150);

  let fee = (new BigNumber(0.01)).dividedBy(price);

  console.log('ten cents', fee);

  let unspent = (await rpcCall('listunspent', [0])).slice(0, 10);

  let change = 'bitcoincash:qz7lh923zdpw6mwtrwsh5kz6y73avghxagup3qlpw5';

  console.log('unspent', unspent);

  let dustInputs = _.filter(unspent, utxo => {

    return utxo.amount < 0.0001;

  }).map(utxo => {

    return {

      "txid": utxo.txid,

      "vout": utxo.vout,

      "amount": new BigNumber(utxo.amount)

    }

  });

  console.log('dust inputs', dustInputs);

  let changeInputs = _.filter(unspent, utxo => {

    return utxo.address === change;

  });

  let totalDust = dustInputs.reduce((sum, input) => {

    return sum.plus(input.amount);
  
  }, new BigNumber(0));

  console.log('total dust', totalDust.toNumber());

  if (totalDust.toNumber() === 0) {

    return;
  }

  var changeInput, changeAmount;

  if (changeInputs.length === 0) {

    changeInput = null; 
    changeAmount = totalDust.minus(fee);

  } else {

    var changeInput = underscore.max(changeInputs, function(i) {
      return i.amount;
    });
    console.log("change input", changeInput);

    let changeInputAmount = new BigNumber(changeInput.amount);

    changeAmount = changeInputAmount.plus(totalDust).minus(fee);

  }

  console.log("change amount", changeAmount.toPrecision(8));

  let outputs = {};

  outputs[change] = parseFloat(changeAmount.toNumber().toFixed(8));

  let inputs = dustInputs.map(i => {
    console.log(i);
    return {
      "txid": i.txid,
      "vout": i.vout
    }
  });

  if (changeInput) {

    inputs.push({
      "txid": changeInput.txid,
      "vout": changeInput.vout
    });
  }
  console.log('outputs', outputs);

  let rawtx = await rpcCall('createrawtransaction', [

    inputs,

    outputs

  ]);

  console.log("rawtx", rawtx);

  let signed = await rpcCall('signrawtransaction', [rawtx]);

  console.log("signedrawtx", signed);

  let res = await rpcCall('sendrawtransaction', [signed.hex]);

  console.log('res', res);

}

