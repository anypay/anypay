const PASSWORD = process.env.DASH_CORE_PASSWORD;
const USER = process.env.DASH_CORE_USER;
const HOST = process.env.DASH_CORE_HOST || "https://dash.batm.anypay.global";
import * as http from "superagent";

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

module.exports.sendPayment = sendPayment;

module.exports.getNewAddress = getNewAddress;

module.exports.listSinceBlock = listSinceBlock;

module.exports.getBestBlockHash = getBestBlockHash;
