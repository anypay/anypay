const http = require("superagent");

let token = process.env.BLOCKCYPHER_TOKEN;

import { log } from '../logger';

import { models } from '../models';

const CALLBACKS_BASE = process.env.BLOCKCYPHER_CALLBACKS_BASE || "https://blockcypher.anypay.global";

export async function publishBTC(hex) {

  let resp = await http.post(`https://api.blockcypher.com/v1/bcy/test/txs/push?token=${token}`).send({
    tx: hex
  });

  return resp.body.hash;

}

function createWebhook(address) {
  return new Promise((resolve, reject) => {
    let webhook = {
      event: "unconfirmed-tx",
      address: address,
      url: `${CALLBACKS_BASE}/blockcypher/webhooks"`
    };

    http
      .post(`https://api.blockcypher.com/v1/dash/main/hooks?token=${token}`)
      .send(webhook)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

function listPayments() {
  return new Promise((resolve, reject) => {

    http
      .get(`https://api.blockcypher.com/v1/dash/main/payments?token=${token}`)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

function createTxConfirmationWebhook(address) {
  return new Promise((resolve, reject) => {
    let webhook = {
      event: "confirmed-tx",
      address: address,
      url:
        `${CALLBACKS_BASE}/blockcypher/webhooks/tx-confirmation`
    };

    http
      .post(`https://api.blockcypher.com/v1/dash/main/hooks?token=${token}`)
      .send(webhook)
      .end((error, response) => {
        if (error) {
          return reject(error);
        }
        resolve(response.body);
      });
  });
}

var BLOCKCYPHER_CALLBACKS_BASE = CALLBACKS_BASE;

var BITCOIN_FEE,
    DASH_FEE,
    LITECOIN_FEE,
    DOGECOIN_FEE;

if (process.env.BLOCKCYPHER_BITCOIN_FEE) {
  BITCOIN_FEE = parseInt(process.env.BLOCKCYPHER_BITCOIN_FEE)
} else {
  BITCOIN_FEE = 10000;
}

if (process.env.BLOCKCYPHER_DASH_FEE) {
  DASH_FEE = parseInt(process.env.BLOCKCYPHER_DASH_FEE)
} else {
  DASH_FEE = 10000;
}

if (process.env.BLOCKCYPHER_LITECOIN_FEE) {
  LITECOIN_FEE = parseInt(process.env.BLOCKCYPHER_LITECOIN_FEE)
} else {
  LITECOIN_FEE = 10000;
}

if (process.env.BLOCKCYPHER_DOGECOIN_FEE) {
  DOGECOIN_FEE = parseInt(process.env.BLOCKCYPHER_DOGECOIN_FEE)
} else {
  DOGECOIN_FEE = 10000;
}

export async function recordAddressForward(forward: any): Promise<any> {

  let addressForward = Object.assign({}, forward);

  addressForward.uid = forward.id;
  delete addressForward.id

  let record = await models.BlockcypherAddressForward.create(addressForward);

  log.info('blockcypher.addressforward.created', record.toJSON());

  return record;

}

export async function recordAddressForwardCallback(addressForwardCallback: any): Promise<any> {

  let record = await models.BlockcypherAddressForwardCallback.create(addressForwardCallback);

  log.info('blockcypher.addressforwardcallback.created', record.toJSON());

  return record;

}

export {
  createWebhook,
  listPayments,
  createTxConfirmationWebhook,
  BITCOIN_FEE,
  LITECOIN_FEE,
  DOGECOIN_FEE,
  DASH_FEE,
  BLOCKCYPHER_CALLBACKS_BASE
}

