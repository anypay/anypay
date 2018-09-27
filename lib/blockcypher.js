const http = require("superagent");

let token = process.env.BLOCKCYPHER_TOKEN;

const CALLBACKS_BASE = process.env.BLOCKCYPHER_CALLBACKS_BASE || "https://blockcypher.anypay.global";

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

module.exports.createWebhook = createWebhook;
module.exports.listPayments = listPayments;
module.exports.createTxConfirmationWebhook = createTxConfirmationWebhook;

module.exports.BLOCKCYPHER_CALLBACKS_BASE = CALLBACKS_BASE;

if (process.env.BLOCKCYPHER_BITCOIN_FEE) {
  module.exports.BITCOIN_FEE = parseInt(process.env.BLOCKCYPHER_BITCOIN_FEE)
} else {
  module.exports.BITCOIN_FEE = 10000;
}

if (process.env.BLOCKCYPHER_DASH_FEE) {
  module.exports.DASH_FEE = parseInt(process.env.BLOCKCYPHER_DASH_FEE)
} else {
  module.exports.DASH_FEE = 10000;
}

if (process.env.BLOCKCYPHER_LITECOIN_FEE) {
  module.exports.LITECOIN_FEE = parseInt(process.env.BLOCKCYPHER_LITECOIN_FEE)
} else {
  module.exports.LITECOIN_FEE = 10000;
}

if (process.env.BLOCKCYPHER_DOGECOIN_FEE) {
  module.exports.DOGECOIN_FEE = parseInt(process.env.BLOCKCYPHER_DOGECOIN_FEE)
} else {
  module.exports.DOGECOIN_FEE = 10000;
}

