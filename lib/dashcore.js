const PASSWORD = process.env.DASH_RPC_PASSWORD;
const USER = process.env.DASH_RPC_USER;
const http = require("superagent");

function getNewAddress() {
  let body = { jsonrpc: "2.0", method: "getnewaddress", params: ["0"], id: 1 };

  return new Promise((resolve, reject) => {
    http
      .post("https://dash.batm.anypayinc.com")
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
      .post("https://dash.batm.anypayinc.com")
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
      .post("https://dash.batm.anypayinc.com")
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
      .post("https://dash.batm.anypayinc.com")
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
