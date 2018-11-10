require('dotenv').config()

const PASSWORD = process.env.DASH_CORE_PASSWORD;
const USER = process.env.DASH_CORE_USER;
const HOST = process.env.DASH_CORE_HOST;

import * as http from "superagent";

async function rpcRequest(method, params) {
  let body = { jsonrpc: "2.0", method: method, params: params, id: 1 };

  let url = `http://${HOST}:${process.env.DASH_CORE_PORT}`;

  console.log("URL", url);

  let resp = await http
    .post(url)
    .send(body)
    .auth(USER, PASSWORD);

  return resp.body.result;

}

export async function getTransaction(hash: string) {

  let rawtx = await rpcRequest('getrawtransaction', [hash]); 

  let tx = await rpcRequest('decoderawtransaction', [rawtx]);

  return tx;
  
}

import { log } from '../../../lib';

function getNewAddress() {
  let body = { jsonrpc: "2.0", method: "getnewaddress", params: ["0"], id: 1 };

  return new Promise((resolve, reject) => {
    http
      .post(HOST)
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.body.result);
        }
      });
  });
}

function sendPayment(address, amount) {
  let body = {
    jsonrpc: "2.0",
    method: "sendtoaddress",
    params: [address, amount.toString()],
    id: 1
  };

  return new Promise((resolve, reject) => {
    http
      .post(HOST)
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.body.result);
        }
      });
  });
}

function listSinceBlock(blockHash) {
  let body = {
    jsonrpc: "2.0",
    method: "listsinceblock",
    params: [blockHash],
    id: 1
  };

  return new Promise((resolve, reject) => {
    http
      .post(HOST)
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.body.result);
        }
      });
  });
}

function getBestBlockHash() {
  let body = {
    jsonrpc: "2.0",
    method: "getbestblockhash",
    params: [],
    id: 1
  };

  return new Promise((resolve, reject) => {
    http
      .post(HOST)
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.body.result);
        }
      });
  });
}

class JsonRpc {

  call(method, params) {

    log.info(`dash.rpc.call.${method}`, params);

    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.DASH_CORE_HOST}:${process.env.DASH_CORE_PORT}`)
        .auth(process.env.DASH_CORE_USER, process.env.DASH_CORE_PASSWORD)
        .timeout({
          response: 5000,  // Wait 5 seconds for the server to start sending,
          deadline: 10000, // but allow 1 minute for the file to finish loading.
        })
        .send({
          method: method,
          params: params || [],
          id: 0
        })
        .end((error, resp) => {
          if (error) { return reject(error) }
          resolve(resp.body);
        });
    });
  }
}

module.exports.rpc = new JsonRpc();

module.exports.sendPayment = sendPayment;

module.exports.getNewAddress = getNewAddress;

module.exports.listSinceBlock = listSinceBlock;

module.exports.getBestBlockHash = getBestBlockHash;
