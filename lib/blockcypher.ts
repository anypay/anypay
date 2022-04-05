const http = require("superagent");

let token = process.env.BLOCKCYPHER_TOKEN;

import { log } from './log';

import { models } from './models';

const CALLBACKS_BASE = process.env.BLOCKCYPHER_CALLBACKS_BASE || "https://blockcypher.anypayinc.com";

export async function publishDASH(hex) {

  return publish('dash', hex)

}

export async function publish(currency, hex) {

  try {

    let resp = await http.post(`https://api.blockcypher.com/v1/${currency}/main/txs/push?token=${token}`).send({
      tx: hex
    });

    return resp.body.hash;

  } catch(error) {

    var error = error.response.body.error

    if (error.match('already exists..')) {

      let hash = error.split('Transaction with hash ')[1].split(' ')[0]

      return hash

    } else {

      log.error('blockcypher.error', error);

      throw error;

    }

  }

}

export async function publishBTC(hex) {

  try {

    let resp = await http.post(`https://api.blockcypher.com/v1/btc/main/txs/push?token=${token}`).send({
      tx: hex
    });

    return resp.body.hash;

  } catch(error) {

    log.error('blockcypher.error', error);

    throw error;

  }

}

