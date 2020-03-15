require('dotenv').config();

import { log } from './logger';

import { isURL } from 'validator';
import { rpcCall } from './jsonrpc';

import { forwardPayment } from './forwarder';

import * as http from 'superagent';

import { channel, exchange, awaitChannel } from './events';

import { AddressForwardOptions } from './interfaces';

const models = require('../models');

export async function forwardUnspent() {

  var resp;

  try {

    resp = await rpcCall('listunspent', [0]);

  } catch(error) {

    console.log(error);

  }

  console.log(`\n\n\n\n\n${resp.length} unspent outputs found\n\n\n\n\n`)

  for (let i=0; i < resp.length; i++) {

    console.log(`looking up forward for address ${resp[i].address}`);

    let forward = await models.AddressForward.findOne({

      where: {

        input_address: resp[i].address

      }

    });

    if (forward) {

      console.log('found unspent output to forward');

      await forwardPayment(resp[i].txid);

      console.log('found unspent output to forward');

    } else {
      console.log(`no forward found for address ${resp[i].address}`);
    }

  }

}

export async function getMemPoolTxs(){

  let resp = await http.post(`https://${process.env.LTC_RPC_HOST}`)
			.auth(process.env.LTC_RPC_USER, process.env.LTC_RPC_PASSWORD)
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

  var txns; 

  return txns;

}

export async function validateAddress(address){

  let response = await rpcCall('validateaddress',[address])

  return response.isvalid

}

export async function createAddressForward(options: AddressForwardOptions) {

  if (!validateAddress(options.destination)) {

    throw new Error(`invalid litecoin address ${options.destination}`);

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

